import React from 'react';

function SelectStatus(props) {
  return (
    <div>
      <select id="status" onChange={props.onChange} value={props.value}>
        <option value="ALL">All</option>
        <option value="NEW">New</option>
        <option value="AUTO_ANNOTATED">Auto annotated</option>
        <option value="ANNOTATED">Annotated</option>
        <option value="SUPER_ANNOTATED">Super annotated</option>
      </select>
    </div>
  );
}

export default SelectStatus;