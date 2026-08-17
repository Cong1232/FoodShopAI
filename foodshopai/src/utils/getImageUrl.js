export const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/150';
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url}`;
};
