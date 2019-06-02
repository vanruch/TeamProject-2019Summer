import React, {Component} from 'react';
import ReactTooltip from "react-tooltip";

class InfoIcon extends Component {

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <span
          className='info-icon'
          data-tip
          data-for={this.props.id}
        >&#x1F6C8;</span>
        <ReactTooltip className='available-tooltip' id={this.props.id} place='bottom' effect='solid'>
          <div className='tooltip-title'>{this.props.title}</div>
          <ul>
            {this.props.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </ReactTooltip>
      </div>
    );
  }
}

export default InfoIcon;
