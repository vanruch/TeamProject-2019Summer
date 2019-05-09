import useImage from 'use-image';
import {Image, Layer, Stage} from 'react-konva';
import {Item, Menu, MenuProvider} from 'react-contexify';
import React, {Component, useState} from 'react';
import 'react-contexify/dist/ReactContexify.min.css';
import DrawingCanvas from './DrawingCanvas';
import * as PropTypes from 'prop-types';
import Popup from 'react-popup';
import Prompt from './Prompt';

const onEditAnnotationClick = (index, annotations) => {
  Popup.registerPlugin('prompt', function ( defaultType, defaultText, callback) {
        let promptType = null;
        let promptText = null;

        let promptChange = function (type, text) {
          promptType = type;
          promptText = text;
        };

        this.create({
          title: 'Update annotaion',
          content: <Prompt type={defaultType} text={defaultText} onChange={promptChange} />,
          buttons: {
            left: ['cancel'],
            right: [{
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
      annotations[index].type = type;
      annotations[index].text = text;
    };

  const defaultType = annotations[index].type;
  const defaultText = annotations[index].text;

  Popup.plugins().prompt(defaultType, defaultText, updateAnnotation);
};

const onDeleteAnnotationClick = (index, setIndex, annotations) => {
  annotations.splice(index,1);
  setIndex(null);
};



const MyMenu = ({onNewAdnotationClick, index, setIndex, annotations}) =>
  <Menu id='canvas_menu'>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
    { (index || index == 0) && <Item onClick={() => onEditAnnotationClick(index, annotations) }>Edytuj adnotację</Item> }
    { (index || index == 0) && <Item onClick={() => onDeleteAnnotationClick(index, setIndex, annotations)}>Usuń adnotację</Item> }
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
          changeAnnotationIndex = {this.props.changeAnnotationIndex}
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

const transformAnnotation = (target, index, annotations) => {
  const {x, y, width, height, scaleX, scaleY} = target.attrs;
  let offetX = width * scaleX, offsetY = height * scaleY;
  annotations[index] = {
    ...annotations[index],
    x1: Math.min(x, x + offetX),
    x2: Math.max(x, x + offetX),
    y1: Math.min(y, y + offsetY),
    y2: Math.max(y, y + offsetY)
  };
  return annotations;
};


const WithMenu = (props) => {
  const [offset, setOffset] = useState({x: 0, y: 0});
  const [scale, setScale] = useState({x: 1, y: 1});
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState(null);
  const [image] = useImage(props.image);
  if (!image) {
    return <div>Loading...</div>;
  }

  const changeAnnotationIndex = (ind) => {
    setSelectedAnnotationIndex(ind);
  };

  image.height *= window.innerWidth / image.width;
  image.width = window.innerWidth;
  return <div>
    <MenuProvider id="canvas_menu">
      <MyCanvas image={image} annotations={props.annotations}
                onAnnotationMove={({currentTarget}, index) => props.onAnnotationsChange(
                  transformAnnotation(currentTarget, index, props.annotations))}
                onAnnotationTransform={({currentTarget}, index) => props.onAnnotationsChange(
                  transformAnnotation(currentTarget, index, props.annotations))}
                onOffsetChange={setOffset}
                onScaleChange={setScale}
                changeAnnotationIndex={changeAnnotationIndex}/>
    </MenuProvider>
    <MyMenu onNewAdnotationClick={({event}) => {
      props.onAnnotationsChange([
        ...props.annotations, {
          x1: (event.layerX - offset.x) / scale.x,
          x2: (event.layerX - offset.x) / scale.x + 100,
          y1: (event.layerY - offset.y) / scale.y,
          y2: (event.layerY - offset.y) / scale.y + 100,
          type: null,
          text: '',
          subRegions: []
        }
      ]);
    }}
    index={selectedAnnotationIndex}
    setIndex={setSelectedAnnotationIndex}
    annotations = {props.annotations}
    />
  </div>;
};

export default WithMenu;
