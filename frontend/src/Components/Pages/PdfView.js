import React, {Component} from 'react';
import {getAllImages} from '../../utils';
import Canvas from '../Canvas';
import Popup from 'react-popup';
import Prompt from '../Prompt';
import { MessageService } from '../../Services/MessageService.js'

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
    Popup.registerPlugin('prompt', function (callback) {
      let promptType = null;
      let promptText = null;
      let promptChange = function (type, text) {
        promptType = type;
        promptText = text;
      };

      this.create({
        title: 'New annotaion',
        content: <Prompt type="linear_plot" text="" onChange={promptChange} />,
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

    /** Call the plugin */
    Popup.plugins().prompt(function (type, text) {
      newAnnotations[newAnnotations.length - 1].type = type;
      newAnnotations[newAnnotations.length - 1].text = text;
    });
    this.setState({annotations: newAnnotations});
    console.log(newAnnotations);
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
