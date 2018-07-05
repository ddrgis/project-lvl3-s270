import validator from 'validator';
import * as renders from './renders';

const feeds = [];

export const getFeeds = () => feeds;
export const addFeed = ({
  title,
  description,
  url,
}) => {
  // TODO: parse
  feeds.push({
    title,
    description,
    url,
  });
  renders.renderFeedList(getFeeds());
};

export const isValidURL = (url) => {
  // TODO: normalize
  if (feeds.map(feed => feed.url).indexOf(url) > -1) {
    return false;
  }
  return validator.isURL(url);
};
