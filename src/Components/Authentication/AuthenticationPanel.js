import React, {useContext, useState} from 'react';
import {Button, ClickAwayListener} from '@material-ui/core';
import UserinfoBanner from './UserinfoBanner';
import LoginForm from './LoginForm';
import {ServiceContext} from '../../Services/SeviceContext';
import './Authentication.css';
import UserDataForm from './UserDataForm';

const AuthenticationPanel = () => {
  const {authService} = useContext(ServiceContext);
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState(authService.username);

  const login = async ({username, password}) => {
    await authService.logIn(username, password);
    setShowPopup(false);
    setUsername(authService.username);
  };

  const logout = () => {
    authService.logOut();
    setUsername();
    setShowPopup(false);
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
