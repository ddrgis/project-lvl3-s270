import validator from 'validator';
import * as renders from './renders';

const feeds = [];

export const getFeeds = () => feeds;
export const addFeed = (url) => {
  // TODO: parse
  feeds.push(url);
  renders.renderFeedList(getFeeds());
};

export const isValidURL = (url) => {
  // TODO: normalize
  if (feeds.indexOf(url) > -1) {
    return false;
  }
  return validator.isURL(url);
};
