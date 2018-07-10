import $ from 'jquery';
import axios from 'axios';
import normalize from 'normalize-url';
import WatchJS from 'melanke-watchjs';
import * as state from './model/state';
import { parseRSS } from './parsers';
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
  axios.get(`${settings.corsProxyURL}${normalize(url)}`).catch(err => {
    console.error(err);
    throw err;
  });

const updateFeeds = () => {
  Promise.all(state.getState().feeds.map(feed => requestRSS(feed.url)))
    .then(responses => {
      Promise.all(responses.map(response => parseRSS(response.data))).then(
        rssData => {
          const responsedArticles = rssData.reduce(
            (acc, val) => [...acc, ...val.articles],
            []
          );
          state.addArticles(responsedArticles);
        }
      );
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
    .then(response => parseRSS(response.data, url))
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
