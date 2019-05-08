import React, {useContext, useState} from 'react';
import {Button, ClickAwayListener} from '@material-ui/core';
import UserinfoBanner from './UserinfoBanner';
import LoginForm from './LoginForm';
import {ServiceContext} from '../../Services/SeviceContext';
import './Authentication.css';
import UserDataForm from './UserDataForm';

const AuthenticationPanel = (props) => {
  const [username, setUsername] = useState(props.username);
  const [showPopup, setShowPopup] = useState(false);
  const {authService} = useContext(ServiceContext);

  const login = ({username, password}) => {
    try {
      authService.logIn(username, password);
      setUsername(username);
      setShowPopup(false);
    } catch (e) { }
  };

  const logout = ({}) => {
    try {
      authService.logOut();
      setUsername();
      setShowPopup(false);
    } catch (e) { }
  };

  return <div>
    <div>
      {username
        ? <UserinfoBanner username={username} onClick={() => setShowPopup(!showPopup)}/>
        : <Button onClick={() => setShowPopup(!showPopup)}>Login</Button>}
    </div>
    {showPopup && <ClickAwayListener onClickAway={() => setShowPopup(false)}>
      <div className='login-popup'>
        {username
          ? <UserDataForm onLogout={logout}/>
          : <LoginForm onLogin={login}/>
        }
      </div>
    </ClickAwayListener>
    }
  </div>;
};

export default AuthenticationPanel;
