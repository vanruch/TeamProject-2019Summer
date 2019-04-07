import useImage from 'use-image';
import {Image, Layer, Rect, Stage} from 'react-konva';
import {Item, Menu, MenuProvider} from 'react-contexify';
import React from 'react';
import 'react-contexify/dist/ReactContexify.min.css';

const MyMenu = ({onNewAdnotationClick, ...props}) =>
  <Menu id='canvas_menu'>
    <Item onClick={onNewAdnotationClick}>Dodaj adnotację</Item>
  </Menu>;

const getColorByIndex = (ind) => {
  // From https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
  const COLORS = [
    '#e6194b',
    '#3cb44b',
    '#ffe119',
    '#4363d8',
    '#f58231',
    '#911eb4',
    '#46f0f0',
    '#f032e6',
    '#bcf60c',
    '#fabebe',
    '#008080',
    '#e6beff',
    '#9a6324',
    '#fffac8',
    '#800000',
    '#aaffc3',
    '#808000',
    '#ffd8b1',
    '#000075',
    '#808080',
    '#000000'];
  return COLORS[ind % COLORS.length];
};

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
        <Layer>
          {props.annotations && props.annotations.map(({x1, y1, x2, y2}, ind) =>
            <Rect
              x={x1} y={y1} width={x2 - x1} height={y2 - y1} draggable stroke={getColorByIndex(ind)}
            />
          )}
        </Layer>
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
