import React, {useContext, useEffect, useState} from 'react';
import Canvas from '../Canvas';
import Popup from 'react-popup';
import Prompt from '../Prompt';
import {ServiceContext} from '../../Services/SeviceContext';
import ThreeDotsSpinner from '../Common/ThreeDotsSpinner';
import {Fab} from '@material-ui/core';
import {Check} from '@material-ui/icons';
import {windowsCloseEventHandler} from '../../utils';
import {Prompt as RouterPrompt} from 'react-router-dom';

function PdfView(props) {
  const [pages, setPages] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [changesDetected, setChangesDetected] = useState(false);
  const [scale, setScale] = useState({x: 1, y: 1});
  const {publicationsService, annotationsService} = useContext(ServiceContext);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPages = await publicationsService.getPublicationPages(props.match.params.id);
      setPages(fetchedPages);
      const fetchedAnnotations = await annotationsService.getAnnotationsForPublication(props.match.params.id);
      const annotationsByPage = fetchedPages.map(({id}) => fetchedAnnotations[id] || []);
      setAnnotations(annotationsByPage);
    };
    setChangesDetected(false);
    fetchData();
  }, [props.match.params.id]);

  const onAnnotationsChange = (i) => (newAnnotations) => {
    if (newAnnotations.length > annotations[i].length) {
      Popup.registerPlugin('prompt', function (callback) {
        let promptType = null;
        let promptText = null;
        let promptChange = function (type, text) {
          promptType = type;
          promptText = text;
        };

        this.create({
          title: 'New annotation',
          content: <Prompt type="linear_plot" text="" onChange={promptChange}/>,
          buttons: {
            left: ['cancel'],
            right: [
              {
                text: 'Save',
                key: '⌘+s',
                className: 'success',
                action: function () {
                  callback(promptType, promptText);
                  Popup.close();
                }
              }]
          }
        });
      });

      /** Call the plugin */
      Popup.plugins().prompt(function (type, text) {
        newAnnotations[newAnnotations.length - 1].data.type = type;
        newAnnotations[newAnnotations.length - 1].data.text = text;
      });
    }

    if (!changesDetected) {
      window.addEventListener('beforeunload', windowsCloseEventHandler);
    }
    const updatedAnnotations = [...annotations];
    updatedAnnotations[i] = newAnnotations;
    setAnnotations(updatedAnnotations);
    setChangesDetected(true);
  };

  props.history.listen(() => {
    window.removeEventListener('beforeunload', windowsCloseEventHandler);
  });

  const saveAnnotations = async () => {
    for (let i = 0; i < pages.length; i++) {
      await annotationsService.saveChanges(annotations[i], pages[i].id);
    }
    setChangesDetected(false);
    window.removeEventListener('beforeunload', windowsCloseEventHandler);
  };

  return (
      <div>
        <RouterPrompt
          when={changesDetected}
          message='You have unsaved changes, are you sure you want to leave?'
        />
        {
          pages.length > 0 && pages.map((page, ind) => <Canvas key={page.id} id={page.id} image={page.imageUrl} annotations={annotations[ind] || []} onAnnotationsChange={onAnnotationsChange(ind)} scale={scale} onScaleChange={setScale}/>)
        }
        {pages.length === 0 && <ThreeDotsSpinner/>}
        {changesDetected && <Fab className='fab' color='primary' onClick={saveAnnotations}>
          <Check/>
        </Fab>}
      </div>

  );
}

PdfView.propTypes = {};
PdfView.defaultProps = {};

export default PdfView;
