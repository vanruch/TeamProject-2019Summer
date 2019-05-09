export const truncateText = (maxLength) => (text) => text.length < maxLength ? text : `${text.substring(0, maxLength - 3)}...`;
