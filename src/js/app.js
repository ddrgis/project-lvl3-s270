import $ from 'jquery';
import _ from 'lodash';
import axios from 'axios';
import normalize from 'normalize-url';
import {
  getState,
  setValidationError,
  toggleRSSLoading,
  addFeed,
  addArticles,
  getArticles,
  showContentContainer
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
      Promise.all(response.map(rss => parseRSS(rss)))
        .then(feeds => {
          const stateArticles = getArticles();
          const articlesByFeed = feeds.map(feed => feed.articles);
          const allArticles = _.flatten(articlesByFeed); // TODO: simplify? reduce?
          const newArticles = allArticles.filter(
            a => !stateArticles.some(sa => sa.title === a.title)
          );
          addArticles(newArticles);
        });
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const handleButtonClick = rssURLInput => e => {
  e.preventDefault();
  const url = rssURLInput.val();
  const state = getState();
  const isValidURL = validateURL(url);
  if (!isValidURL) {
    return;
  }
  toggleRSSLoading();
  requestRSS(url)
    .then(response => parseRSS(response, url))
    .then(({ feed, articles }) => {
      addFeed(feed);
      addArticles(articles);
      if (state.ui.isHiddenRSSContent) {
        showContentContainer();
      }
    })
    .then(() => {
      toggleRSSLoading();
      setTimeout(updateFeeds(), settings.rssUpdateTimeout);
    })
    .catch(err => {
      toggleRSSLoading();
      handleError(err);
      setTimeout(updateFeeds(), settings.rssUpdateTimeout);
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
