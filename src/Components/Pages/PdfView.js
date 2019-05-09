import React, {useContext, useEffect, useState} from 'react';
import Canvas from '../Canvas';
import Popup from 'react-popup';
import Prompt from '../Prompt';
import {ServiceContext} from '../../Services/SeviceContext';
import ThreeDotsSpinner from '../Common/ThreeDotsSpinner';

function PdfView(props) {
  const [page, setPage] = useState(null);
  const [annotations, setAnnotations] = useState(JSON.parse(localStorage.getItem('annotations')) || []);
  const {publicationsService} = useContext(ServiceContext);

  useEffect(() => {
    const fetchData = async () => {
      const page = await publicationsService.getPage(props.match.params.id, props.match.params.page);
      setPage(page);
    };
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
          title: 'New annotaion',
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
        newAnnotations[newAnnotations.length - 1].type = type;
        newAnnotations[newAnnotations.length - 1].text = text;
      });
    }

    setAnnotations(newAnnotations);
    localStorage.setItem('annotations', JSON.stringify(newAnnotations));
  };

  return (
    <div>
      {page ? <Canvas image={page.src} annotations={annotations} onAnnotationsChange={onAnnotationsChange}/> : <ThreeDotsSpinner/>}
    </div>
  );
}

PdfView.propTypes = {};
PdfView.defaultProps = {};

export default PdfView;
