import {createContext} from 'react';
import AuthService from './AuthService';
import MessageService from './MessageService';
import PublicationsService from './PublicationsService';

export function setup () {
  const messageService = new MessageService();
  return {
    authService: new AuthService(messageService),
    publicationsService: new PublicationsService(),
    messageService
  }
}

export const ServiceContext = createContext({});
