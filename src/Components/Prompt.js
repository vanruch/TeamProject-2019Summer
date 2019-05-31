import React, {Component} from 'react';
import ReactTags from 'react-tag-autocomplete';
import {availableTypes} from '../common';

export default class Prompt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: this.props.type.map(typeSlug => availableTypes.find(availableType => availableType.value === typeSlug)),
      text: this.props.text
    };
    this.props.onChange(this.state.type.map(type => type.value), this.state.text);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.type.length !== this.state.type.length || prevState.text !== this.state.text) {
      this.props.onChange(this.state.type.map(type => type.value), this.state.text);
    }
  }

  onTextChange(e) {
    let value = e.target.value;
    this.setState({text: value});
  }

  onDelete(i) {
    const types = this.state.type.slice(0);
    types.splice(i, 1);
    this.setState({type: types});
  }

  onAddition(type) {
    const types = [].concat(this.state.type, type);
    this.setState({type: types});
  }

  onValidate(tag) {
    return !this.state.type.find(t => t.value === tag.value);
  }

  render() {
    return <div>
      Type:
      <ReactTags
        minQueryLength={1}
        placeholderText={'Add new type'}
        tags={this.state.type}
        suggestions={availableTypes}
        onValidate={this.onValidate.bind(this)}
        onDelete={this.onDelete.bind(this)}
        onAddition={this.onAddition.bind(this)}
      />
      {this.state.type && this.state.type.includes("chata_reference") && <div>Text:
      <input type="text" className="mm-popup__input" value={this.state.text} onChange={this.onTextChange.bind(this)}/></div>}
    </div>;
  }
}
