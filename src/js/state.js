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

export const getArticles = () => state.articles;

export const addArticles = articles => {
  const oldArticles = state.articles;
  const newArticles = articles.filter(article =>
    !oldArticles.some(a => a.title === article.title));

  state.articles = [...oldArticles, ...newArticles];

  if (oldArticles.length === 0) {
    renders.renderArticlesList(getArticles());
  } else {
    renders.renderNewArticles(newArticles);
  }
};

export const setValidationError = error => {
  state.ui.validationError = error;
  renders.renderValidationError(error);
};

export const resetValidationError = () => {
  state.ui.validationError = '';
  renders.renderValidationError('');
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
