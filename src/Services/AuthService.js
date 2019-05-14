import {fetchBody} from '../utils';

const apiUrl = 'http://annotations.mini.pw.edu.pl/api/annotations';
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf8"
};

const NOT_LOGGED_IN_MESSAGE = 'Nie jesteś zalogowany';
const BAD_PASSWORD_MESSAGE = 'Zły login lub hasło.';

export default class AuthService {
  onUsernameChange = (username) => {};

  constructor(messageService) {
    this.messageService = messageService;
  }

  async logIn(username, password) {
    try {
      const {value: authToken} = await fetchBody(`${apiUrl}/users/login`, {
        method: 'POST',
        body: JSON.stringify({
          password,
          username
        }),
        headers
      });
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('authToken', authToken);
      this.onUsernameChange(username);
    } catch (e) {
      if (/400/.exec(e)) {
        this.messageService.showError(BAD_PASSWORD_MESSAGE);
      }
      throw e;
    }
  }

  logOut() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('username');
    this.onUsernameChange(null);
  }

  get token() {
    return sessionStorage.getItem('authToken')
  }

  get username() {
    return sessionStorage.getItem('username')
  }

  async ensureLoggedIn() {
    if (!this.username) {
      this.messageService.showError(NOT_LOGGED_IN_MESSAGE);
      throw NOT_LOGGED_IN_MESSAGE;
    }
  }

  setUsernameChangeListener(callback) {
    this.onUsernameChange = callback;
  }
}
