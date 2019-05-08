export default class AuthService {
  constructor(messageService) {
    this.messageService = messageService;
  }

  logIn(username, password) {
    if (password !== 'admin') {
      this.messageService.showError('Password and username do not match');
      throw new Error('Authentication error');
    }
  }

  logOut() {
  }
}
