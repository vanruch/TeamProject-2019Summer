import useImage from 'use-image';
import {Image, Layer, Rect, Stage} from 'react-konva';
import {Item, Menu, MenuProvider} from 'react-contexify';
import React from 'react';
import 'react-contexify/dist/ReactContexify.min.css';
import DrawingCanvas from './DrawingCanvas';

const MyMenu = ({onNewAdnotationClick, ...props}) =>
  <Menu id='canvas_menu'>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
  </Menu>;

export const Canvas = (props) => {
  const [image] = useImage(props.image);
  if (!image) {
    return <div>Loading...</div>;
  }
  image.height *= window.innerWidth / image.width;
  image.width = window.innerWidth;
  return <div>
    <MenuProvider id="canvas_menu">
      <Stage width={window.innerWidth} height={image.height}>
        <Layer>
          <Image image={image}/>
        </Layer>
        <DrawingCanvas annotations={props.annotations}/>
      </Stage>
    </MenuProvider>
    <MyMenu onNewAdnotationClick={({event, props: p2}) => {
      console.log(p2, event);
      props.onAnnotationsChange([
        ...props.annotations, {
          x1: event.layerX,
          x2: event.layerX + 100,
          y1: event.layerY,
          y2: event.layerY + 100,
          type: null,
          text: '',
          subRegions: []
        }]);
    }}/>
  </div>;
};
