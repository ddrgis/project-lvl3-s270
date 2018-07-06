import $ from 'jquery';
import {
  addFeed,
  addArticles,
} from './state';

const parseRSS = (url) => {
  $.getJSON(`http://anyorigin.com/go/?url=${url}&callback=?`)
    .done((response) => {
      const parser = new DOMParser(); // eslint-disable-line
      const doc = parser.parseFromString(response.contents, 'application/xml');
      const jDoc = $(doc);
      const title = jDoc.find('channel>title');
      const titleText = title ? title.text() : undefined;

      const description = jDoc.find('channel>description');
      const descriptionText = description ? description.text() : undefined;

      addFeed({
        title: titleText,
        description: descriptionText,
        url,
      });

      const items = jDoc.find('item');
      const articles = items.map((index) => {
        const jItem = $(items[index]);
        const articleTitle = jItem.find('title');
        const link = jItem.find('link');
        return {
          title: articleTitle ? articleTitle.text() : undefined,
          link: link ? link.text() : undefined,
        };
      });

      addArticles(articles);
    })
    .fail((jqxhr, textStatus, error) => {
      const err = `${textStatus}, ${error}`;
      console.log(`Request Failed: ${err}`);
    });
};

export default parseRSS;

