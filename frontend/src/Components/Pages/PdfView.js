import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getAllImages} from '../../utils';
import {withStyles} from '@material-ui/core/styles';

const styles = {
  image: {
    height: '100%',
    width: '100%'
  },
};

class PdfView extends Component {
  state = {
    image: null
  };

  componentDidMount() {
    const image = getAllImages()[this.props.match.params.id];
    this.setState({image});
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <img src={this.state.image} className={classes.image}/>
      </div>
    );
  }
}

PdfView.propTypes = {};
PdfView.defaultProps = {};

export default withStyles(styles)(PdfView);
