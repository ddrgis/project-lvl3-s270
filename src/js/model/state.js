import WatchJS from 'melanke-watchjs';
import * as renders from '../view/renders';
import { normilizeUrl } from '../utils';

const { watch } = WatchJS;

const state = {
  feeds: [],
  articles: [],
  app: {
    isUpdateTimerSetted: false
  },
  ui: {
    validationError: '',
    isRSSLoading: false
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
};

export const getArticles = () => state.articles;
export const addArticles = articles => {
  state.articles = [...state.articles, ...articles];
};

export const getValidationError = () => state.ui.validationError;
export const setValidationError = error => {
  state.ui.validationError = error;
};
export const resetValidationError = () => {
  state.ui.validationError = '';
};

export const isRSSLoading = () => state.ui.isRSSLoading;
export const setRSSLoading = value => {
  state.ui.isRSSLoading = value;
};

export const isUpdateTimerSetted = () => state.app.isUpdateTimerSetted;
export const toggleUpdateTimer = () => {
  state.app.isUpdateTimerSetted = !state.app.isUpdateTimerSetted;
};

watch(state, 'feeds', () => renders.renderFeedList(getFeeds()));
watch(state, 'feeds', () => {
  if (state.feeds.length > 0) {
    renders.showContentContainer();
  }
});
watch(state, 'articles', () => renders.renderArticlesListNew(getArticles()));
watch(state.ui, 'validationError', () => renders.renderValidationError(getValidationError()));
watch(state.ui, 'isRSSLoading', () => renders.toggleRSSLoading(isRSSLoading()));
