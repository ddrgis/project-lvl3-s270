import $ from 'jquery';
import axios from 'axios';
import normalize from 'normalize-url';
import {
  getState,
  isValidURL,
  setValidationError,
  toggleRSSLoading,
  hideRSSContent,
  setUpdateTimer,
  addFeed,
  addArticles,
  showRSSContent
} from './state';
import { parseRSS, updateFeeds } from './parsers';

const handleError = err => {
  console.log(err);
  if (err.response && err.response.status === 404) {
    setValidationError('Please enter existed URL');
  } else {
    setValidationError(err.message);
  }
};

export const requestRSS = url =>
  axios
    .get(`https://cors-anywhere.herokuapp.com/${normalize(url)}`, {
      Accept: 'text/javascript, */*'
    })
    .then(response => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(response.data, 'application/xml');
      const rss = $(dom).find('rss');
      if (rss.length === 0) {
        throw new Error(`There is no RSS feed at ${url}`);
      }
      return rss;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

export default ({ rssUpdateInterval }) => {
  toggleRSSLoading(); // TODO: extract to init method
  hideRSSContent(); // TODO: extract to init method
  const rssSubmitButton = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  rssSubmitButton.on('click', e => {
    e.preventDefault();
    const url = rssURLInput[0].value;

    if (!isValidURL(url)) {
      setValidationError('This URL is already parsed'); // TODO: call new validate method instead of isValidURL. There are another errors could be here!
      return;
    }

    rssURLInput[0].value = '';
    toggleRSSLoading();
    requestRSS(url)
      .then(response => parseRSS(response, url))
      .then(({ feed, articles }) => {
        addFeed(feed);
        addArticles(articles);
        showRSSContent();
      })
      .then(() => {
        if (!getState().app.isUpdateTimerSetted) {
          setInterval(() => updateFeeds(), rssUpdateInterval);
          setUpdateTimer();
        }
        toggleRSSLoading();
      })
      .catch(err => {
        toggleRSSLoading();
        handleError(err);
      });
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
