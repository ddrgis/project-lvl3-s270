import validator from 'validator';
import { normilizeUrl } from './utils';
import { getState, setValidationError, resetValidationError } from './state';

const isDuplicativeURL = url => {
  const normalizedUrl = normilizeUrl(url);
  return (
    getState()
      .feeds.map(feed => feed.url)
      .indexOf(normalizedUrl) > -1
  );
};

export const validateURL = url => {
  if (!url) {
    resetValidationError();
    return false;
  }

  if (!validator.isURL(url)) {
    setValidationError('Please enter valid URL');
    return false;
  }

  if (isDuplicativeURL(url)) {
    setValidationError('This URL is already parsed');
    return false;
  }

  resetValidationError();
  return true;
};

export default validateURL;
