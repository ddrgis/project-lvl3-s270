import $ from 'jquery';
import _ from 'lodash';
import axios from 'axios';
import normalize from 'normalize-url';
import {
  getState,
  setValidationError,
  setRSSLoading,
  addFeed,
  addArticles,
  isUpdateTimerSetted,
  toggleUpdateTimer
} from './model/state';
import { parseDocument, parseRSS } from './parsers';
import { validateURL } from './validator';
import settings from '../settings';

const handleError = err => {
  console.error(err);
  if (err.response && err.response.status === 404) {
    setValidationError('Please enter existed URL');
  } else {
    setValidationError(err.message);
  }
};

export const requestRSS = url =>
  axios
    .get(`${settings.corsProxyURL}${normalize(url)}`)
    .then(response => parseDocument(response.data, 'application/xml'))
    .then(document => {
      const rss = document.querySelector('rss');
      if (!rss || rss.length === 0) {
        throw new Error(`There is no RSS feed at ${url}`);
      }
      return rss;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });

const updateFeeds = () => {
  const state = getState();
  Promise.all(state.feeds.map(feed => requestRSS(feed.url)))
    .then(response => {
      Promise.all(response.map(rss => parseRSS(rss))).then(feeds => {
        const articlesByFeed = feeds.map(feed => feed.articles);
        const allArticles = _.flatten(articlesByFeed); // TODO: simplify? reduce?
        addArticles(allArticles);
      });
    })
    .then(setTimeout(updateFeeds, settings.rssUpdateTimeout))
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const handleButtonClick = rssURLInput => e => {
  e.preventDefault();
  const url = rssURLInput.val();
  const isValidURL = validateURL(url);
  if (!isValidURL) {
    return;
  }
  setRSSLoading(true);
  requestRSS(url)
    .then(response => parseRSS(response, url))
    .then(({ feed, articles }) => {
      addFeed(feed);
      addArticles(articles);
    })
    .then(() => {
      setRSSLoading(false);
      if (!isUpdateTimerSetted()) {
        setTimeout(updateFeeds, settings.rssUpdateTimeout);
        toggleUpdateTimer();
      }
    })
    .catch(err => {
      setRSSLoading(false);
      handleError(err);
    });
};

const setUpEventHandlers = () => {
  const rssSubmitButton = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  rssSubmitButton.on('click', handleButtonClick(rssURLInput));
  rssURLInput.on('keyup', e => {
    validateURL(e.target.value);
  });
};

const startApplication = () => {
  setUpEventHandlers();
};

export default startApplication;
