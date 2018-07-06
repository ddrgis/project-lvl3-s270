import validator from 'validator';
import * as renders from './renders';
import { normilizeUrl } from './utils';

const state = {
  feeds: [],
  articles: [],
  ui: {},
};

export const getFeeds = () => state.feeds;
export const addFeed = ({
  title,
  description,
  url,
}) => {
  state.feeds = [...state.feeds, {
    title,
    description,
    url: normilizeUrl(url),
  }];

  renders.renderFeedList(getFeeds());
};

export const isValidURL = (url) => {
  const normalizedUrl = normilizeUrl(url);
  if (state.feeds.map(feed => feed.url).indexOf(normalizedUrl) > -1) {
    return false;
  }
  return validator.isURL(url);
};
