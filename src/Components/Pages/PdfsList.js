import React, {Component, useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import {ServiceContext} from '../../Services/SeviceContext';

const styles = theme => ({
  root: {
    padding: '2%'
  },
  paper: {
    cursor: 'pointer',
    height: '100%',
    width: '100%',
    '&:hover': {
      height: '101%',
      width: '101%',
      margin: '-1%'
    }
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 5
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

class PdfPreview extends Component {
  state = {
    elevation: 2
  };

  onMouseOver = () => this.setState({elevation: 8});
  onMouseOut = () => this.setState({elevation: 2});

  render() {
    const {classes, src, key, ind} = this.props;
    return <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={key}>
      <Link to={`/paper/${ind}`}>
        <Paper className={classes.paper} elevation={this.state.elevation}
               onMouseOver={this.onMouseOver}
               onMouseOut={this.onMouseOut}>
          <img src={src} className={classes.image} alt="Pdf preview"/>
        </Paper>
      </Link>
    </Grid>;
  }
}

PdfPreview.propTypes = {
  classes: PropTypes.any,
  src: PropTypes.any
};

function PdfsList({classes}) {
  const [publications, setPublications] = useState([]);
  const {publicationsService} = useContext(ServiceContext);

  useEffect(() => {
    publicationsService.getPublicationPreviews(1).then(setPublications);
  }, []);

  return (
    <Grid container className={classes.root} spacing={24}>
      {publications.map(({src}, ind) => <PdfPreview key={src} ind={ind} classes={classes} src={src}/>)}
    </Grid>
  );
}

export default withStyles(styles)(PdfsList);
