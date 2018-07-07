import $ from 'jquery';
import { isValidURL, setValidationError } from './state';
import parseRSS from './parsers';
import { renderRSSInputLoader } from './renders';

const handleError = err => {
  console.log(err);
  if (err.response && err.response.status === 404) {
    setValidationError('Please enter existed URL');
  } else {
    setValidationError(err.message);
  }
};

export default () => {
  renderRSSInputLoader(false);
  const rssSubmitButton = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  rssSubmitButton.on('click', e => {
    e.preventDefault();
    const url = rssURLInput[0].value;

    if (!isValidURL(url)) {
      return;
    }

    rssURLInput[0].value = '';
    parseRSS(url).catch(err => handleError(err));
  });

  rssURLInput.on('keypress', e => {
    if (!isValidURL(e.target.value)) {
      rssURLInput.addClass('border border-danger');
      setValidationError('Please enter valid URL');
    } else {
      rssURLInput.removeClass('border border-danger');
      setValidationError('');
    }
  });
};
