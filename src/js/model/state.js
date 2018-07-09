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
  const oldArticles = state.articles;
  const newArticles = articles.filter(
    article => !oldArticles.some(a => a.title === article.title)
  );

  state.articles = [...oldArticles, ...newArticles];

  if (oldArticles.length === 0) {
    renders.renderArticlesList(getArticles());
  } else {
    renders.renderNewArticles(newArticles);
  }
};

export const getValidationError = () => state.ui.validationError;
export const setValidationError = error => {
  state.ui.validationError = error;
};
export const resetValidationError = () => {
  state.ui.validationError = '';
};

export const isRSSLoading = () => state.ui.isRSSLoading;
export const toggleRSSLoading = () => {
  state.ui.isRSSLoading = !state.ui.isRSSLoading;
};

watch(state, 'feeds', () => renders.renderFeedList(getFeeds()));
watch(state, 'feeds', () => {
  if (state.feeds.length > 0) {
    renders.showContentContainer();
  }
});
// TODO: watch(state.articles)
watch(state.ui, 'validationError', () => renders.renderValidationError(getValidationError()));
watch(state.ui, 'isRSSLoading', () => renders.toggleRSSLoading(isRSSLoading()));
