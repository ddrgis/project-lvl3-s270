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
  console.log(err);
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
      const rss = $(dom).find('rss');
      if (rss.length === 0) {
        throw new Error(`There is no RSS feed at ${url}`);
      }
      return rss;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

const updateFeeds = () => {
  const state = getState();
  Promise.all(state.feeds.map(feed => requestRSS(feed.url)))
    .then(response => {
      Promise.all(response.map(rss => parseRSS(rss)))
        .then(feeds => {
          const stateArticles = getArticles();
          const articlesByFeed = feeds.map(feed => feed.articles.toArray());
          const allArticles = _.flatten(articlesByFeed);
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
      console.log(err);
      throw err;
    });
};

const startApplication = ({ rssUpdateInterval }) => {
  const rssSubmitButton = $('#btn-submit');
  const rssURLInput = $('#input-rss-url');

  rssSubmitButton.on('click', e => {
    e.preventDefault();
    const url = rssURLInput.val();

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
        showContentContainer();
      })
      .then(() => {
        if (!getState().app.isUpdateTimerSetted) {
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
      rssURLInput.addClass('border border-danger');
      setValidationError('Please enter valid URL');
      return;
    }

    rssURLInput.removeClass('border border-danger');
    setValidationError('');
  });
};

export default startApplication;
