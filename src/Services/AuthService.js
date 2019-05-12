import {fetchBodyWithStatus} from '../utils';

const apiUrl = 'http://104.211.24.171/api/annotations';
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf8"
};

export default class AuthService {
  constructor(messageService) {
    this.messageService = messageService;
  }

  async logIn(username, password) {

    const response =  await fetchBodyWithStatus(`${apiUrl}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        password: password,
        username: username
      }),
      headers
    });
    const status = response.status
    if(status !== 200){
        return false;
    }
    const responseJson = await response.json();
    const authToken = responseJson['value'];
    sessionStorage.setItem('authToken', authToken);

    return true;
  }

  logOut() {
    sessionStorage.removeItem('authToken');
  }

}
