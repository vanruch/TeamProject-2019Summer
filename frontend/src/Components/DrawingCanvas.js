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

class TransformerComponent extends React.Component {
  componentDidMount() {
    this.checkNode();
  }

  componentDidUpdate() {
    this.checkNode();
  }

  checkNode() {
    // here we need to manually attach or detach Transformer node
    const stage = this.transformer.getStage();
    const {selectedShapeName} = this.props;

    const selectedNode = stage.findOne('.' + selectedShapeName);
    console.log(selectedNode);
    // do nothing if selected node is already attached
    if (selectedNode === this.transformer.node()) {
      return;
    }

    if (selectedNode) {
      // attach to another node
      this.transformer.attachTo(selectedNode);
    } else {
      // remove transformer
      this.transformer.detach();
    }
    this.transformer.getLayer().batchDraw();
  }

  render() {
    return (
      <Transformer
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

  handleStageMouseDown = e => {
    // clicked on stage - cler selection
    if (e.target === e.target.getStage()) {
      this.setState({
        selectedShapeName: ''
      });
      return;
    }
    // clicked on transformer - do nothing
    const clickedOnTransformer =
      e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
      return;
    }

    // find clicked rect by its name
    const name = e.target.name();
    // const rect = this.state.rectangles.find(r => r.name === name);
    // if (rect) {
    this.setState({
      selectedRect: name
    });
    // } else {
    //   this.setState({
    //     selectedShapeName: ''
    //   });
    // }
  };

  render() {
    return (
      <Layer onMouseDown={this.handleStageMouseDown}>
        {this.props.annotations && this.props.annotations.map(({x1, y1, x2, y2}, ind) =>
          <Rect
            x={x1} y={y1} width={x2 - x1} height={y2 - y1} draggable stroke={getColorByIndex(ind)} strokeScaleEnabled={false} name={`rect${ind}`}
          />
        )}
        <TransformerComponent selectedShapeName={this.state.selectedRect}/>
      </Layer>
    );
  }
}

DrawingCanvas.propTypes = {};
DrawingCanvas.defaultProps = {};

export default DrawingCanvas;
