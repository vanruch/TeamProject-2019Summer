import React, {useEffect, useState} from 'react';
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

export default function BarWithDrawer({pageTitleLoader}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const toggleDrawer = (openDrawer) => () => setOpenDrawer(openDrawer);

  useEffect(() => {
    (async () => setPageTitle(await pageTitleLoader()))();
  }, [pageTitleLoader]);

  return <div>
    <AppBar position="fixed" color="white" elevation={0}>
      <Toolbar>
        <IconButton color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
          <MenuIcon/>
        </IconButton>
        <Typography variant="h4" align="center" color="inherit" className="title" style={{fontWeight: 300}}>
          {pageTitle}
        </Typography>
        <AuthenticationPanel/>
      </Toolbar>
    </AppBar>
    <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
      <div
        tabIndex={0}
        role="button"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List>
          <Link to='/' style={{textDecoration: 'none'}}>
            <ListItem>
              <ListItemIcon style={{marginBottom: '2px'}}>
                <Apps/>
              </ListItemIcon>
              <ListItemText primary="All pages"/>
            </ListItem>
          </Link>
        </List>
      </div>
    </Drawer>
  </div>;
}

BarWithDrawer.propTypes = {
  pageTitle: PropTypes.string
};

