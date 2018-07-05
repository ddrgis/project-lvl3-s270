import $ from 'jquery';
import {
  isValidURL,
  addFeed,
} from './feeds';

export default () => {
  const submitBtn = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  submitBtn.on('click', (e) => {
    e.preventDefault();
    if (!isValidURL(rssURLInput[0].value)) {
      return;
    }

    addFeed(rssURLInput[0].value);
    rssURLInput[0].value = '';
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
