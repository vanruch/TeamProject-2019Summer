import { toast } from 'react-toastify';

export const MessageService = {
  showSuccess: function(message) {
    toast.success(message, {
        autoClose: 3000,
        position: toast.POSITION.TOP_LEFT
      });
  },

  showError: function(message) {
    toast.error(message, {
        autoClose: 3000,
        position: toast.POSITION.TOP_LEFT
      });
  },

  showInfo: function(message) {
    toast.info(message, {
        autoClose: 3000,
        position: toast.POSITION.TOP_LEFT
      });
  },

  showWarn: function(message) {
    toast.warn(message, {
        autoClose: 3000,
        position: toast.POSITION.TOP_LEFT
      });
  }
};
