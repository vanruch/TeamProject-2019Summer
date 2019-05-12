import useImage from 'use-image';
import {Image, Layer, Stage} from 'react-konva';
import {Item, Menu, MenuProvider} from 'react-contexify';
import React, {Component, useState} from 'react';
import 'react-contexify/dist/ReactContexify.min.css';
import DrawingCanvas from './DrawingCanvas';
import * as PropTypes from 'prop-types';
import Popup from 'react-popup';
import Prompt from './Prompt';
import ThreeDotsSpinner from './Common/ThreeDotsSpinner';

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

const MyMenu = ({onNewAdnotationClick, onEditAnnotationClick, onDeleteAnnotationClick, index, setIndex, annotations}) =>
  <Menu id='canvas_menu'>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
    {(index || index === 0) && <Item onClick={() => onEditAnnotationClick(index, annotations)}>Edytuj adnotację</Item>}
    {(index || index === 0) &&
    <Item onClick={() => onDeleteAnnotationClick(index, setIndex, annotations)}>Usuń adnotację</Item>}
  </Menu>;

class MyCanvas extends Component {
  state = {
    scale: {
      x: 1,
      y: 1
    },
    selectedAnnotationIndex: null
  };

  dragBound({x, y}) {
    const newBounds = {
      x: Math.min(0, Math.max(x, (-this.props.image.width) * this.state.scale.x + window.innerWidth)),
      y: Math.min(0, Math.max(y, (-this.props.image.height) * this.state.scale.y + window.innerHeight))
    };
    this.props.onOffsetChange(newBounds);
    return newBounds;
  }

  onZoom({evt, target}) {
    evt.preventDefault();
    const oldScale = this.state.scale.x;

    const newScale = Math.max(1, evt.deltaY < 0 ? oldScale * 1.05 : oldScale / 1.05);
    this.props.onScaleChange({x: newScale, y: newScale});
    this.setState({scale: {x: newScale, y: newScale}});
  }

  render() {
    return <Stage width={this.props.image.width} height={this.props.image.height} onWheel={this.onZoom.bind(this)}
                  scale={this.state.scale} draggable dragBoundFunc={this.dragBound.bind(this)}
    >
      <Layer>
        <Image image={this.props.image}
        />
      </Layer>
      <DrawingCanvas
        changeAnnotationIndex={this.props.changeAnnotationIndex}
        annotations={this.props.annotations}
        onAnnotationMove={this.props.onAnnotationMove}
        onAnnotationTransform={this.props.onAnnotationTransform}
      />
    </Stage>;
  }
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
    <MenuProvider id="canvas_menu">
      <MyCanvas image={image} annotations={scaleUpAnnotations()}
                onAnnotationMove={({currentTarget}, index) => props.onAnnotationsChange(
                  transformAnnotation(currentTarget, index, props.annotations, image))}
                onAnnotationTransform={({currentTarget}, index) => props.onAnnotationsChange(
                  transformAnnotation(currentTarget, index, props.annotations, image))}
                onOffsetChange={setOffset}
                onScaleChange={setScale}
                changeAnnotationIndex={changeAnnotationIndex}/>
    </MenuProvider>
    <MyMenu onNewAdnotationClick={({event}) => {
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
            onEditAnnotationClick={onEditAnnotationClick(props)}
            onDeleteAnnotationClick={onDeleteAnnotationClick(props)}
    />
  </div>;
};

export default WithMenu;
