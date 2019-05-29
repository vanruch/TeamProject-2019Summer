import {createContext} from 'react';
import AuthService from './AuthService';
import MessageService from './MessageService';
import PublicationsService from './PublicationsService';
import AnnotationsService from './AnnotationsService';
import HelperService from './HelperService';
import AnnotationsControllerService from './AnnotationsControllerService';

export function setup () {
  const messageService = new MessageService();
  const authService = new AuthService(messageService);
  return {
    authService,
    publicationsService: new PublicationsService(authService),
    annotationsService: new AnnotationsService(authService),
    helperService: new HelperService(),
    annotationsControllerService: new AnnotationsControllerService(),
    messageService
  }
}

export const ServiceContext = createContext({});
