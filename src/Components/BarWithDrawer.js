import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import * as PropTypes from 'prop-types';
import AuthenticationPanel from './Authentication/AuthenticationPanel';
import {Link} from 'react-router-dom';
import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {Apps} from '@material-ui/icons';

export default class BarWithDrawer extends Component {
  state = {
    openDrawer: false
  };

  toggleDrawer = (openDrawer) => () => {
    this.setState({
      openDrawer,
    });
  };

  render() {
    return <div>
      <AppBar position="sticky" color="white" elevation={0}>
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" onClick={this.toggleDrawer(true)}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h4" align="center" color="inherit" className="title" style={{fontWeight: 300}}>
            {this.props.pageTitle}
          </Typography>
          <AuthenticationPanel/>
        </Toolbar>
      </AppBar>
      <Drawer open={this.state.openDrawer} onClose={this.toggleDrawer(false)}>
        <div
          tabIndex={0}
          role="button"
          onClick={this.toggleDrawer(false)}
          onKeyDown={this.toggleDrawer(false)}
        >
          <List>
            <Link to='/' style={{ textDecoration: 'none' }}>
              <ListItem>
                <ListItemIcon style={{ marginBottom: '2px' }}>
                  <Apps/>
                </ListItemIcon>
                <ListItemText primary="All pages" />
              </ListItem>
            </Link>
          </List>
        </div>
      </Drawer>
    </div>;
  }
}

BarWithDrawer.propTypes = {
  pageTitle: PropTypes.string
};
