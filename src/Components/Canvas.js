import useImage from 'use-image';
import {Image, Layer, Stage} from 'react-konva';
import {Item, Menu, MenuProvider} from 'react-contexify';
import React, {useContext, useState} from 'react';
import 'react-contexify/dist/ReactContexify.min.css';
import DrawingCanvas from './DrawingCanvas';
import * as PropTypes from 'prop-types';
import Popup from 'react-popup';
import Prompt from './Prompt';
import ThreeDotsSpinner from './Common/ThreeDotsSpinner';
import {ServiceContext} from '../Services/SeviceContext';
import Helper from './Common/Helper';

const onEditAnnotationClick = (onAnnotationsChange) => (index, annotations) => {
  Popup.registerPlugin('prompt', function (defaultType, defaultText, callback) {
    let promptType = null;
    let promptText = null;

    let promptChange = function (type, text) {
      promptType = type;
      promptText = text;
    };

    this.create({
      title: 'Update annotation',
      content: <Prompt type={defaultType} text={defaultText} onChange={promptChange}/>,
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

  let updateAnnotation = (type, text) => {
    annotations[index].data.type = type;
    annotations[index].data.text = text;
  };

  const defaultType = annotations[index].data.type;
  const defaultText = annotations[index].data.text;

  Popup.plugins().prompt(defaultType, defaultText, updateAnnotation);

  onAnnotationsChange(annotations);
};

const onDeleteAnnotationClick = (onAnnotationsChange) => (index, setIndex, annotations) => {
  annotations.splice(index, 1);
  setIndex(null);
  onAnnotationsChange(annotations);
};

const MyMenu = ({onNewAdnotationClick, onEditAnnotationClick, onDeleteAnnotationClick, index, setIndex, annotations, id}) =>
  <Menu id={id}>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
    {(index || index === 0) && <Item onClick={() => onEditAnnotationClick(index, annotations)}>Edytuj adnotację</Item>}
    {(index || index === 0) &&
    <Item onClick={() => onDeleteAnnotationClick(index, setIndex, annotations)}>Usuń adnotację</Item>}
  </Menu>;

function MyCanvas({image, scale, offset, onBoundsChange, onScaleChange, changeAnnotationIndex, annotations, onAnnotationMove, onAnnotationTransform}) {
  const [showZoomHelper, setShowZoomHelper] = useState(false);
  const {helperService} = useContext(ServiceContext);

  const dragBound = ({x}) => {
    if (scale.x <= 1) {
      return {x: offset.x, y: 0};
    }
    const newBounds = {
      x: Math.min(0, Math.max(x, (-image.width) * scale.x + window.innerWidth)),
      y: 0
    };
    onBoundsChange(newBounds);
    return newBounds;
  };

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const isInZoomMode = (evt) => {
    return (isMac && evt.metaKey) || (!isMac && evt.altKey);
  };

  const onZoom = ({evt}) => {
    if (!isInZoomMode(evt)) {
      if (helperService.showZoomHelper()) {
        setShowZoomHelper(true);
      }
      return;
    }
    evt.preventDefault();
    const oldScale = scale.x;

    const newScale = Math.max(0.2, evt.deltaY < 0 ? oldScale * 1.15 : oldScale / 1.15);
    onScaleChange({x: newScale, y: newScale});
  };

  const getHelperText = () => {
    if (isMac) {
      return 'Trzymaj ⌘ i skroluj by zmienić zoom';
    }
    return 'Trzymaj alt i skroluj by zmienić zoom';
  };

  return <div>
    <Helper visible={showZoomHelper} text={getHelperText()}/>
    <Stage width={image.width} height={image.height * scale.x} onWheel={onZoom}
           scale={scale} x={offset.x} draggable dragBoundFunc={dragBound}
    >
      <Layer>
        <Image image={image}/>
      </Layer>
      <DrawingCanvas
        changeAnnotationIndex={changeAnnotationIndex}
        annotations={annotations}
        onAnnotationMove={onAnnotationMove}
        onAnnotationTransform={onAnnotationTransform}
      />
    </Stage>
  </div>;
}

MyCanvas.propTypes = {
  image: PropTypes.any,
  props: PropTypes.any
};

const transformAnnotation = (target, index, annotations, imageAttrs) => {
  const {x, y, width, height, scaleX, scaleY} = target.attrs;
  let offetX = width * scaleX, offsetY = height * scaleY;
  annotations[index].data = {
    ...annotations[index].data,
    x1: (Math.min(x, x + offetX)) / imageAttrs.width,
    x2: (Math.max(x, x + offetX)) / imageAttrs.width,
    y1: (Math.min(y, y + offsetY)) / imageAttrs.height,
    y2: (Math.max(y, y + offsetY)) / imageAttrs.height
  };
  return annotations;
};

const WithMenu = ({annotations, image, scale, id, onScaleChange, onAnnotationsChange}) => {
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState(null);
  const [downloadedImage] = useImage(image);
  if (!downloadedImage) {
    return <ThreeDotsSpinner/>;
  }

  const centerBounds = (bounds) => {
    const imageWidth = downloadedImage.width * scale.x;
    const screenWidth = window.innerWidth;
    return {
      ...bounds,
      x: (screenWidth - imageWidth) / 2
    };
  };

  const changeAnnotationIndex = (ind) => {
    setSelectedAnnotationIndex(ind);
  };

  downloadedImage.height *= window.innerWidth / downloadedImage.width;
  downloadedImage.width = window.innerWidth;

  const scaleUpAnnotations = () => annotations.map(({data: {x1, x2, y1, y2}}) => ({
    x1: x1 * downloadedImage.width,
    x2: x2 * downloadedImage.width,
    y1: y1 * downloadedImage.height,
    y2: y2 * downloadedImage.height
  }));

  return <div>
    <MenuProvider id={`canvas_menu${id}`}>
      <MyCanvas image={downloadedImage} annotations={scaleUpAnnotations()}
                scale={scale} offset={centerBounds(offset)}
                onAnnotationMove={({currentTarget}, index) => onAnnotationsChange(
                  transformAnnotation(currentTarget, index, annotations, downloadedImage))}
                onAnnotationTransform={({currentTarget}, index) => onAnnotationsChange(
                  transformAnnotation(currentTarget, index, annotations, downloadedImage))}
                onBoundsChange={setOffset}
                onScaleChange={onScaleChange}
                changeAnnotationIndex={changeAnnotationIndex}
      />
    </MenuProvider>
    <MyMenu id={`canvas_menu${id}`} onNewAdnotationClick={({event}) => {
      onAnnotationsChange([
        ...annotations, {
          data: {
            x1: ((event.layerX - offset.x) / scale.x) / downloadedImage.width,
            x2: ((event.layerX - offset.x) / scale.x + 100) / downloadedImage.width,
            y1: ((event.layerY - offset.y) / scale.y) / downloadedImage.height,
            y2: ((event.layerY - offset.y) / scale.y + 100) / downloadedImage.height,
            type: null,
            text: '',
            subRegions: []
          }
        }
      ]);
    }}
            index={selectedAnnotationIndex}
            setIndex={setSelectedAnnotationIndex}
            annotations={annotations}
            onEditAnnotationClick={onEditAnnotationClick(onAnnotationsChange)}
            onDeleteAnnotationClick={onDeleteAnnotationClick(onAnnotationsChange)}
    />
  </div>;
};

export default WithMenu;
