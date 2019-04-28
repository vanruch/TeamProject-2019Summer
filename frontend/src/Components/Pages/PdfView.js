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
    this.setState({annotations: newAnnotations});
    Popup.registerPlugin('prompt', function (defaultValue, placeholder, callback) {
      let promptValue = null;
      let promptChange = function (value) {
        promptValue = value;
      };

      this.create({
        title: 'What\'s your name?',
        content: <Prompt onChange={promptChange} placeholder={placeholder} value={defaultValue} />,
        buttons: {
          left: ['cancel'],
          right: [{
            text: 'Save',
            key: '⌘+s',
            className: 'success',
            action: function () {
              callback(promptValue);
              Popup.close();
            }
          }]
        }
      });
    });

    /** Call the plugin */
    Popup.plugins().prompt('', 'Type your name', function (value) {
      MessageService.showSuccess('You typed: ' + value);
    });
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
