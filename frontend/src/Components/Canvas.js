import useImage from 'use-image';
import {Image, Layer, Stage} from 'react-konva';
import {Item, Menu, MenuProvider} from 'react-contexify';
import React, {Component} from 'react';
import 'react-contexify/dist/ReactContexify.min.css';
import DrawingCanvas from './DrawingCanvas';
import * as PropTypes from 'prop-types';

const MyMenu = ({onNewAdnotationClick}) =>
  <Menu id='canvas_menu'>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
  </Menu>;

class MyCanvas extends Component {
  state = {
    scale: {
      x: 1,
      y: 1
    },
    x: 0,
    y: 0
  };

  dragBound({x, y}) {
    return {
      x: Math.min(0, Math.max(x, (-this.props.image.width) * this.state.scale.x + window.innerWidth)),
      y: Math.min(0, Math.max(y, (-this.props.image.height) * this.state.scale.y + window.innerHeight))
    };
  }

  onZoom({evt, target}) {
    evt.preventDefault();
    const oldScale = this.state.scale.x;

    const newScale = Math.max(1, evt.deltaY < 0 ? oldScale * 1.05 : oldScale / 1.05);
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
      <DrawingCanvas annotations={this.props.annotations} onAnnotationMove={this.props.onAnnotationMove}/>
    </Stage>;
  }
}

MyCanvas.propTypes = {
  image: PropTypes.any,
  props: PropTypes.any
};

const moveAnnotation = (target, index, annotations) => {
  const {x, y, width, height} = target.attrs;
  annotations[index] = {
    ...annotations[index],
    x1: x,
    x2: x + width,
    y1: y,
    y2: y + height
  };
  return annotations;
};

const WithMenu = (props) => {
  const [image] = useImage(props.image);
  if (!image) {
    return <div>Loading...</div>;
  }
  image.height *= window.innerWidth / image.width;
  image.width = window.innerWidth;
  return <div>
    <MenuProvider id="canvas_menu">
      <MyCanvas image={image} annotations={props.annotations}
                onAnnotationMove={({currentTarget}, index) => props.onAnnotationsChange(
                  moveAnnotation(currentTarget, index, props.annotations))}/>
    </MenuProvider>
    <MyMenu onNewAdnotationClick={({event}) => {
      props.onAnnotationsChange([
        ...props.annotations, {
          x1: event.layerX,
          x2: event.layerX + 100,
          y1: event.layerY,
          y2: event.layerY + 100,
          type: null,
          text: '',
          subRegions: []
        }
      ]);
    }}/>
  </div>;
};

export default WithMenu;
