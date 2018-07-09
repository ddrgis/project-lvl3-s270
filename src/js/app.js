import $ from 'jquery';
import _ from 'lodash';
import axios from 'axios';
import normalize from 'normalize-url';
import {
  getState,
  isValidURL,
  setValidationError,
  toggleRSSLoading,
  setUpdateTimer,
  addFeed,
  addArticles,
  getArticles,
  showContentContainer
} from './state';
import { parseRSS } from './parsers';

const handleError = err => {
  console.error(err);
  if (err.response && err.response.status === 404) {
    setValidationError('Please enter existed URL');
  } else {
    setValidationError(err.message);
  }
};

export const requestRSS = url =>
  axios
    .get(`https://cors-anywhere.herokuapp.com/${normalize(url)}`)
    .then(response => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(response.data, 'application/xml');
      const rss = dom.querySelector('rss');
      if (rss.length === 0) {
        throw new Error(`There is no RSS feed at ${url}`);
      }
      return rss;
    })
    .catch(err => {
      console.error(err);
      throw err;
    });

const updateFeeds = () => {
  const state = getState();
  Promise.all(state.feeds.map(feed => requestRSS(feed.url)))
    .then(response => {
      Promise.all(response.map(rss => parseRSS(rss)))
        .then(feeds => {
          const stateArticles = getArticles();
          const articlesByFeed = feeds.map(feed => feed.articles);
          const allArticles = _.flatten(articlesByFeed); // TODO: optimise
          const newArticles = allArticles.filter(
            a => !stateArticles.some(sa => sa.title === a.title)
          );
          addArticles(newArticles);
        })
        .catch(err => {
          console.error(err);
          throw err;
        });
    })
    .catch(err => {
      console.error(err);
      throw err;
    });
};

const startApplication = ({ rssUpdateInterval }) => {
  const rssSubmitButton = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  rssSubmitButton.on('click', e => {
    e.preventDefault();
    const url = rssURLInput.val();
    const state = getState();

    if (!isValidURL(url)) {
      setValidationError('This URL is already parsed'); // TODO: call new validate method instead of isValidURL. There are another errors could be here!
      return;
    }

    toggleRSSLoading();
    requestRSS(url)
      .then(response => parseRSS(response, url))
      .then(({ feed, articles }) => {
        addFeed(feed);
        addArticles(articles);
        if (state.ui.isHiddenRSSContent) {
          showContentContainer();
        }
      })
      .then(() => {
        if (!state.app.isUpdateTimerSetted) {
          setInterval(() => updateFeeds(), rssUpdateInterval);
          setUpdateTimer();
        }
        toggleRSSLoading();
      })
      .catch(err => {
        toggleRSSLoading();
        handleError(err);
      });
  });

  rssURLInput.on('keyup', e => {
    if (e.target.value && !isValidURL(e.target.value)) {
      setValidationError('Please enter valid URL');
      return;
    }

    setValidationError('');
  });
};

export default startApplication;
