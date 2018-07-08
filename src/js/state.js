import validator from 'validator';
import * as renders from './renders';
import { normilizeUrl } from './utils';

const state = {
  feeds: [],
  articles: [],
  app: {
    isUpdateTimerSetted: false
  },
  ui: {
    validationError: '',
    isRSSLoading: false,
    isHiddenRSSContent: true
  }
};

export const getState = () => state;

export const getFeeds = () => state.feeds;

export const addFeed = ({ title, description, url }) => {
  state.feeds = [
    ...state.feeds,
    {
      title,
      description,
      url: normilizeUrl(url)
    }
  ];

  renders.renderFeedList(getFeeds());
};

export const isValidURL = url => {
  const isURL = validator.isURL(url);
  if (!isURL) {
    return false;
  }
  const normalizedUrl = normilizeUrl(url);
  if (state.feeds.map(feed => feed.url).indexOf(normalizedUrl) > -1) {
    return false;
  }
  return true;
};

export const getArticles = () => state.articles;

export const addArticles = articles => {
  state.articles = [...state.articles, ...articles];
  renders.renderArticlesList(getArticles()); // TODO: rerender only new articles!
};

export const setValidationError = error => {
  state.ui.validationError = error;
  renders.renderValidationError(error);
};

export const toggleRSSLoading = () => {
  state.ui.isRSSLoading = !state.ui.isRSSLoading;
  renders.toggleRSSLoading(state.ui.isRSSLoading);
};

export const showContentContainer = () => {
  state.ui.isHiddenRSSContent = false;
  renders.showContentContainer();
};

export const setUpdateTimer = () => {
  state.app.isUpdateTimerSetted = true;
};
