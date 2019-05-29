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

const onCopyAnnotationClick = (props) => (index, annotations) => {
  const copyOffset = 0.025;
  const copy =  {
    data: {
      x1: annotations[index].data.x1 + copyOffset,
      x2: annotations[index].data.x2 + copyOffset,
      y1: annotations[index].data.y1 + copyOffset,
      y2: annotations[index].data.y2 + copyOffset,
      type: annotations[index].data.type,
      text: annotations[index].data.text,
      subRegions: []
    }
  };

  props.onAnnotationsChange([...annotations, copy], true);
};

const onEditAnnotationClick = (props) => (index, annotations) => {
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

  props.onAnnotationsChange(annotations);
};

const onDeleteAnnotationClick = (props) => (index, setIndex, annotations) => {
  annotations.splice(index, 1);
  setIndex(null);
  props.onAnnotationsChange(annotations);
};

const MyMenu = ({onNewAdnotationClick, onCopyAnnotationClick, onEditAnnotationClick, onDeleteAnnotationClick, index, setIndex, annotations, id}) =>
  <Menu id={id}>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
    {(index || index === 0) && <Item onClick={() => onCopyAnnotationClick(index, annotations)}>Kopiuj adnotację</Item>}
    {(index || index === 0) && <Item onClick={() => onEditAnnotationClick(index, annotations)}>Edytuj adnotację</Item>}
    {(index || index === 0) &&
    <Item onClick={() => onDeleteAnnotationClick(index, setIndex, annotations)}>Usuń adnotację</Item>}
  </Menu>;

function MyCanvas(props) {
  const [scale, setScale] = useState({x: 1, y: 1});
  const [offset, setOffset] = useState({x: 1, y: 1});
  const [showZoomHelper, setShowZoomHelper] = useState(false);
  const {helperService} = useContext(ServiceContext);

  const centerBounds = (bounds) => {
    const imageWidth = props.image.width * scale.x;
    const screenWidth = window.innerWidth;
    if (imageWidth > screenWidth) {
      return bounds;
    }
    return {
      ...bounds,
      x: (screenWidth - imageWidth) / 2
    };
  };

  const centerBoundsLargeScale = (bounds) => {
    const imageWidth = props.image.width * scale.x;
    const screenWidth = window.innerWidth;
    if (imageWidth <= screenWidth) {
      return bounds;
    }
    return {
      ...bounds,
      x: (screenWidth - imageWidth) / 2
    };
  };

  const dragBound = ({x}) => {
    const newBounds = centerBounds({
      x: Math.min(0, Math.max(x, (-props.image.width) * scale.x + window.innerWidth)),
      y: 0
    });
    props.onBoundsChange(newBounds);
    setOffset(newBounds);
    return newBounds;
  };

  const onZoom = ({evt, target}) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    if (!(isMac && evt.metaKey) || (!isMac && evt.ctrlKey)) {
      if (helperService.showZoomHelper()) {
        setShowZoomHelper(true);
      }
      return;
    }
    evt.preventDefault();
    const oldScale = scale.x;

    const newScale = Math.max(0.2, evt.deltaY < 0 ? oldScale * 1.05 : oldScale / 1.05);
    setScale({x: newScale, y: newScale});
    props.onScaleChange(scale);
    setOffset(centerBoundsLargeScale(centerBounds(offset)));
    props.onBoundsChange(offset);
  };

  return <div>
    <Helper visible={showZoomHelper} text='Trzymaj ⌘ i skroluj by zmienić zoom'/>
    <Stage width={props.image.width} height={props.image.height * scale.x} onWheel={onZoom}
           scale={scale} draggable dragBoundFunc={dragBound} x={offset.x}
    >
      <Layer>
        <Image image={props.image}/>
      </Layer>
      <DrawingCanvas
        changeAnnotationIndex={props.changeAnnotationIndex}
        annotations={props.annotations}
        onAnnotationMove={props.onAnnotationMove}
        onAnnotationTransform={props.onAnnotationTransform}
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

const WithMenu = (props) => {
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [scale, setScale] = useState({x: 1, y: 1});
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState(null);
  const [image] = useImage(props.image);
  if (!image) {
    return <ThreeDotsSpinner/>;
  }

  const changeAnnotationIndex = (ind) => {
    setSelectedAnnotationIndex(ind);
  };

  image.height *= window.innerWidth / image.width;
  image.width = window.innerWidth;

  const scaleUpAnnotations = () => props.annotations.map(({data: {x1, x2, y1, y2}}) => ({
    x1: x1 * image.width,
    x2: x2 * image.width,
    y1: y1 * image.height,
    y2: y2 * image.height
  }));

  return <div>
    <MenuProvider id={`canvas_menu${props.id}`}>
      <MyCanvas image={image} annotations={scaleUpAnnotations()}
                onAnnotationMove={({currentTarget}, index) => props.onAnnotationsChange(
                  transformAnnotation(currentTarget, index, props.annotations, image))}
                onAnnotationTransform={({currentTarget}, index) => props.onAnnotationsChange(
                  transformAnnotation(currentTarget, index, props.annotations, image))}
                onBoundsChange={setOffset}
                onScaleChange={setScale}
                changeAnnotationIndex={changeAnnotationIndex}/>
    </MenuProvider>
    <MyMenu id={`canvas_menu${props.id}`} onNewAdnotationClick={({event}) => {
      props.onAnnotationsChange([
        ...props.annotations, {
          data: {
            x1: ((event.layerX - offset.x) / scale.x) / image.width,
            x2: ((event.layerX - offset.x) / scale.x + 100) / image.width,
            y1: ((event.layerY - offset.y) / scale.y) / image.height,
            y2: ((event.layerY - offset.y) / scale.y + 100) / image.height,
            type: null,
            text: '',
            subRegions: []
          }
        }
      ]);
    }}
            index={selectedAnnotationIndex}
            setIndex={setSelectedAnnotationIndex}
            annotations={props.annotations}
            onCopyAnnotationClick={onCopyAnnotationClick(props)}
            onEditAnnotationClick={onEditAnnotationClick(props)}
            onDeleteAnnotationClick={onDeleteAnnotationClick(props)}
    />
  </div>;
};

export default WithMenu;
