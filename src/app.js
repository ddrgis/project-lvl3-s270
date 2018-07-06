import $ from 'jquery';
import { isValidURL } from './state';
import parseRSS from './parsers';

export default () => {
  const rssSubmitButton = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  rssSubmitButton.on('click', (e) => {
    e.preventDefault();
    const url = rssURLInput[0].value;

    if (!isValidURL(url)) {
      return;
    }

    rssURLInput[0].value = '';
    parseRSS(url);
  });

  rssURLInput.on('keypress', (e) => {
    if (!isValidURL(e.target.value)) {
      rssURLInput.addClass('border border-danger');
    } else {
      rssURLInput.removeClass('border border-danger');
    }
  });
};
