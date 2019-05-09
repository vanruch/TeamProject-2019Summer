export const truncateText = (maxLength) => (text) => text.length < maxLength ? text : `${text.substring(0, maxLength - 3)}...`;

export const fetchBody = async (...args) => (await fetch(...args)).json();

export const windowsCloseEventHandler = (ev) => {
  ev.preventDefault();
  return ev.returnValue = 'If you will leave the changes will not be saved';
};

