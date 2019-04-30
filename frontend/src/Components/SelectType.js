import React, {Component} from 'react';


class SelectType extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div>
        <select id="annotation_type" on onChange={this.props.onChange} value={this.props.value}>
          <option value="linear_plot">Linear plot</option>
          <option value="pie_chart">Pie chart</option>
          <option value="dot_plot">Dot plot</option>
          <option value="column_plot">Column plot</option>
          <option value="box_plot">Box plot</option>
          <option value="table">Table</option>
          <option value="chata_reference">ChaTa reference</option>
        </select>
      </div>
    )
  }
}

export default SelectType;