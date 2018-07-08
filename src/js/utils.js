import normalize from 'normalize-url';

export const normilizeUrl = url => {
  const normalizeOptions = {
    normalizeHttps: true
  };
  return normalize(url, normalizeOptions);
};

export default normilizeUrl;
