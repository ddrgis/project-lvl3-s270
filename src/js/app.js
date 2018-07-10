import $ from 'jquery';
import _ from 'lodash';
import axios from 'axios';
import normalize from 'normalize-url';
import WatchJS from 'melanke-watchjs';
import * as state from './model/state';
import { parseDocument, parseRSS } from './parsers';
import { validateURL } from './validator';
import settings from '../settings';
import * as renders from './view/renders';

const handleError = err => {
  console.error(err);
  if (err.response && err.response.status === 404) {
    state.setValidationError('Please enter existed URL');
  } else {
    state.setValidationError(err.message);
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
  Promise.all(state.getState().feeds.map(feed => requestRSS(feed.url)))
    .then(response => {
      Promise.all(response.map(rss => parseRSS(rss))).then(feeds => {
        const articlesByFeed = feeds.map(feed => feed.articles);
        const allArticles = _.flatten(articlesByFeed); // TODO: simplify? reduce?
        state.addArticles(allArticles);
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
  state.setRSSLoading(true);
  requestRSS(url)
    .then(response => parseRSS(response, url))
    .then(({ feed, articles }) => {
      state.addFeed(feed);
      state.addArticles(articles);
    })
    .then(() => {
      state.setRSSLoading(false);
      if (!state.isUpdateTimerSetted()) {
        setTimeout(updateFeeds, settings.rssUpdateTimeout);
        state.toggleUpdateTimer();
      }
    })
    .catch(err => {
      state.setRSSLoading(false);
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

const setModelChangeHandlers = () => {
  const appState = state.getState();
  const { watch } = WatchJS;
  watch(appState, 'feeds', () => renders.renderFeedList(state.getFeeds()));
  watch(appState, 'feeds', () => {
    if (appState.feeds.length > 0) {
      renders.showContentContainer();
    }
  });
  watch(appState, 'articles', () =>
    renders.renderArticlesListNew(state.getArticles())
  );
  watch(appState.ui, 'validationError', () =>
    renders.renderValidationError(state.getValidationError())
  );
  watch(appState.ui, 'isRSSLoading', () =>
    renders.toggleRSSLoading(state.isRSSLoading())
  );
};

const startApplication = () => {
  setUpEventHandlers();
  setModelChangeHandlers();
};

export default startApplication;
