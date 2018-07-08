import validator from 'validator';
import * as renders from './renders';
import { normilizeUrl } from './utils';

const state = {
  feeds: [],
  articles: [],
  ui: {
    validationError: '',
    isRSSLoading: true,
    isHiddenRSSContent: true
  }
};

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
  renders.renderArticlesList(getArticles()); // TODO: add sorting
};

export const setValidationError = error => {
  state.ui.validationError = error;
  renders.renderValidationError(error);
};

export const toggleRSSLoading = () => {
  state.ui.isRSSLoading = !state.ui.isRSSLoading;
  renders.toggleRSSInputLoader(state.ui.isRSSLoading);
};

export const hideRSSContent = () => {
  state.ui.isHiddenRSSContent = true;
  renders.hideRSSContent();
};

export const showRSSContent = () => {
  state.ui.isHiddenRSSContent = false;
  renders.showRSSContent();
};
