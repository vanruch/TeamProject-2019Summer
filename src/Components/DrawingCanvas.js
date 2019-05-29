import React, {Component} from 'react';
import {Layer, Rect, Transformer} from 'react-konva';

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

const initRectSize = 100;

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    const stage = this.transformer.getStage();
    const {selectedShapeName} = this.props;

    const selectedNode = stage.findOne('.' + selectedShapeName);
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      this.transformer.attachTo(selectedNode);
    } else {
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }

  render() {
    return (
      <Transformer
        rotateEnabled={false}
        keepRatio={false}
        ref={node => {
          this.transformer = node;
        }}
      />
    );
  }
}

class DrawingCanvas extends Component {
  state = {
    selectedRect: null
  };

  selectedRects() {
    return this.props.selectedAnnotations ? this.props.selectedAnnotations.map(({annotationIndex}) => `rect${annotationIndex}`) : [];
  }

  render() {
    return (
      <Layer>
        {this.props.annotations && this.props.annotations.map(({x1, y1, x2, y2}, ind) =>
          <Rect onClick={(evt) => this.props.changeAnnotationIndex(ind, evt)}
                x={x1} y={y1} width={initRectSize} height={initRectSize} scaleX={(x2 - x1) / initRectSize}
                scaleY={(y2 - y1) / initRectSize}
                draggable
                onDragEnd={(args) => this.props.onAnnotationMove(args, ind)}
                onTransformEnd={(args) => this.props.onAnnotationTransform(args, ind)}
                stroke={getColorByIndex(ind)}
                strokeScaleEnabled={false}
                name={`rect${ind}`}
                key={ind}
          />
        )}
        {this.selectedRects().map((rectName) => <TransformerComponent selectedShapeName={rectName}/>)}
      </Layer>
    );
  }
}

export default DrawingCanvas;
