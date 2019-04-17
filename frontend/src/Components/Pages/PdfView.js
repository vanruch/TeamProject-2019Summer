import React, {Component} from 'react';
import {getAllImages} from '../../utils';
import Canvas from '../Canvas';

class PdfView extends Component {
  state = {
    image: null,
    annotations: []
  };

  componentDidMount() {
    const image = getAllImages()[this.props.match.params.id];
    this.setState({image});
  }

  onAnnotationsChange(newAnnotations) {
    this.setState({annotations: newAnnotations});
  }

  render() {
    return (
      <div>
        {this.state.image && <Canvas image={this.state.image} annotations={this.state.annotations}
                                     onAnnotationsChange={this.onAnnotationsChange.bind(this)}/>}
      </div>
    );
  }
}

PdfView.propTypes = {};
PdfView.defaultProps = {};

export default PdfView;
