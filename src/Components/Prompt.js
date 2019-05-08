import React, {Component} from 'react';
import SelectType from './SelectType';

export default class Prompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: this.props.type,
      text: this.props.text
    };
    this.props.onChange(this.state.type, this.state.text);
    this.onTextChange = (e) => this._onTextChange(e);
    this.onTypeChange = (e) => this._onTypeChange(e);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.type !== this.state.type || prevState.type !== this.state.text) {
      this.props.onChange(this.state.type, this.state.text);
    }
  }

  _onTextChange(e) {
    let value = e.target.value;

    this.setState({text: value});
  }

  _onTypeChange(e) {
    let value = e.target.value;

    this.setState({type: value});
  }



  render() {
    return <div>
      Type:<SelectType onChange={this.onTypeChange} value={this.state.type}/>
      Text:<input type="text" className="mm-popup__input" value={this.state.text} onChange={this.onTextChange} />
    </div>;
  }
}
