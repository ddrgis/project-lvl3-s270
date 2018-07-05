import $ from 'jquery';
import { addFeed } from './feeds';

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
    })
    .fail((jqxhr, textStatus, error) => {
      const err = `${textStatus}, ${error}`;
      console.log(`Request Failed: ${err}`);
    });
};

export default parseRSS;
