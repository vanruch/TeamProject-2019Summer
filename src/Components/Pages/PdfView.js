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
  const [page, setPage] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [changesDetected, setChangesDetected] = useState(false);
  const {publicationsService, annotationsService} = useContext(ServiceContext);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedPage = await publicationsService.getPage(props.match.params.id, props.match.params.page);
      setPage(fetchedPage);
      const annotations = await annotationsService.getAnnotations(fetchedPage.page.id);
      setAnnotations(annotations);
    };
    setChangesDetected(false);
    fetchData();
  }, [props.match.params.id, props.match.params.page]);

  const onAnnotationsChange = (newAnnotations) => {
    if (newAnnotations.length > annotations.length) {
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

    setAnnotations(newAnnotations);
    setChangesDetected(true);
  };

  props.history.listen(() => {
    window.removeEventListener('beforeunload', windowsCloseEventHandler);
  });

  const saveAnnotations = async () => {
    await annotationsService.saveChanges(annotations, page.page.id);
    setChangesDetected(false);
    window.removeEventListener('beforeunload', windowsCloseEventHandler);
  };

  return (
      <div>
        <RouterPrompt
          when={changesDetected}
          message='You have unsaved changes, are you sure you want to leave?'
        />
        {page ?
          <Canvas image={page.page.imageUrl} annotations={annotations} onAnnotationsChange={onAnnotationsChange}/>
          : <ThreeDotsSpinner/>}
        {changesDetected && <Fab className='fab' color='primary' onClick={saveAnnotations}>
          <Check/>
        </Fab>}
      </div>

  );
}

PdfView.propTypes = {};
PdfView.defaultProps = {};

export default PdfView;
