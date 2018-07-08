import axios from 'axios';
import normalize from 'normalize-url';
import $ from 'jquery';
import { addFeed, addArticles, toggleRSSLoading, showRSSContent } from './state';

const parseRSS = url => {
  toggleRSSLoading();
  return axios
    .get(`https://cors-anywhere.herokuapp.com/${normalize(url)}`, {
      Accept: 'text/javascript, */*'
    })
    .then(response => {
      const parser = new DOMParser(); // eslint-disable-line
      const dom = parser.parseFromString(response.data, 'application/xml');
      const rss = $(dom).find('rss');
      if (rss.length === 0) {
        throw new Error(`There is no RSS feed at ${url}`);
      }
      const title = rss.find('channel>title');
      const titleText = title ? title.text() : undefined;
      const description = rss.find('channel>description');
      const descriptionText = description ? description.text() : undefined;
      addFeed({
        title: titleText,
        description: descriptionText,
        url
      });
      const items = rss.find('item');
      const articles = items.map(index => {
        const jItem = $(items[index]);
        const articleTitle = jItem.find('title');
        const link = jItem.find('link');
        return {
          title: articleTitle ? articleTitle.text() : undefined,
          link: link ? link.text() : undefined
        };
      });
      addArticles(articles);
      showRSSContent();
    })
    .then(() => toggleRSSLoading())
    .catch(err => {
      console.log(err);
      toggleRSSLoading();
      throw err;
    });
};

export default parseRSS;
