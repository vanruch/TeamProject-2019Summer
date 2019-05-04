import {createContext} from 'react';
import AuthService from './AuthService';
import MessageService from './MessageService';

export function setup () {
  const messageService = new MessageService();
  return {
    authService: new AuthService(messageService),
    messageService
  }
}

export const ServiceContext = createContext({});
