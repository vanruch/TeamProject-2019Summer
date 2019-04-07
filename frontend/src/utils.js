export const getAllImages = () => {
  const importAll = r => r.keys().map(r);

  return importAll(require.context('./PlaceholderPdfs', false, /\.(png|jpe?g|svg)$/));
};
