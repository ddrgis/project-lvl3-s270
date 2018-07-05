import $ from 'jquery';
import {
  isValidURL,
  addFeed,
} from './feeds';
import parseRSS from './parsers';

export default () => {
  const submitBtn = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  submitBtn.on('click', (e) => {
    e.preventDefault();
    const url = rssURLInput[0].value;

    if (!isValidURL(url)) {
      return;
    }

    addFeed(rssURLInput[0].value);
    rssURLInput[0].value = '';
    parseRSS(url);
  });

  rssURLInput.on('keypress', (e) => {
    console.log(e);
    if (!isValidURL(e.target.value)) {
      rssURLInput.addClass('border border-danger');
    } else {
      rssURLInput.removeClass('border border-danger');
    }
  });
};
