import {createContext} from 'react';
import AuthService from './AuthService';
import MessageService from './MessageService';
import PublicationsService from './PublicationsService';
import AnnotationsService from './AnnotationsService';

export function setup () {
  const messageService = new MessageService();
  return {
    authService: new AuthService(messageService),
    publicationsService: new PublicationsService(),
    annotationsService: new AnnotationsService(),
    messageService
  }
}

export const ServiceContext = createContext({});
