import $ from 'jquery';
import { addFeed, addArticles } from './state';
import axios from 'axios';
import nomalize from 'normalize-url';

const parseRSS = feedURL => {
  const url = nomalize(feedURL);
  console.log('1');

  axios
    .get(`https://crossorigin.me/${url}`, {
      Origin: 'https://crossorigin.me',
      Accept: 'text/javascript, */*'
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));

  axios({
    method: 'get',
    url: `https://crossorigin.me/${url}`,
    Origin: 'https://crossorigin.me',
    Accept: 'text/javascript, */*'
  })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));

  const instance = axios.create({
    baseURL: `https://crossorigin.me/${url}`,
    headers: {
      Accept: 'text/javascript, application/json, text/plain, text/html, */*'
    }
  });

  instance
    .get(`https://crossorigin.me/${url}`)
    .then(response => {
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
        url
      });
      const items = jDoc.find('item');
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
    })
    .catch(err => console.log(err));

  instance({
    method: 'get',
    url: `https://crossorigin.me/${url}`,
    headers: {
      Accept: 'text/javascript, application/json, text/plain, text/html, */*'
    }
  })
    .then(response => {
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
        url
      });

      const items = jDoc.find('item');
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
    })
    .catch(err => {
      console.log(err);
    });

  //////////////////////////////////////////////////////////// ANY ORIGIN: /////////////////////////////////////////////////////////////////

  fetch(`http://anyorigin.com/go/?url=${url}&callback=?`, {
    method: 'GET',
    mode: 'no-cors'
  })
    .then(res => {
      console.log(res);
      res.json();
    })
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));

  $.ajax({
    url: `http://anyorigin.com/go/?url=${url}&callback=?`,
    success: function(data) {
      console.log(data);
    },
    error: function(error, a, b) {
      console.log(error);
      console.log(a);
    }
  });

  axios
    .get(`http://anyorigin.com/go/?url=${url}&callback=?`, {
      Origin: 'http://anyorigin.com',
      Accept: 'text/javascript, */*'
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));

  axios({
    method: 'get',
    url: `http://anyorigin.com/go/?url=${url}&callback=?`,
    Origin: 'http://anyorigin.com',
    Accept: 'text/javascript, */*'
  })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err));

  const instance2 = axios.create({
    baseURL: `http://anyorigin.com/go/?url=${url}&callback=?`,
    headers: {
      Accept: 'text/javascript, application/json, text/plain, text/html, */*'
    }
  });

  instance2
    .get(`http://anyorigin.com/go/?url=${url}&callback=?`)
    .then(response => {
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
        url
      });
      const items = jDoc.find('item');
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
    })
    .catch(err => console.log(err));

  instance2({
    method: 'get',
    url: `http://anyorigin.com/go/?url=${url}&callback=?`,
    headers: {
      Accept: 'text/javascript, application/json, text/plain, text/html, */*'
    }
  })
    .then(response => {
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
        url
      });

      const items = jDoc.find('item');
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
    })
    .catch(err => {
      console.log(err);
    });

  // $.getJSON(`http://anyorigin.com/go/?url=${url}&callback=?`)
  //   .done(response => {
  //     const parser = new DOMParser(); // eslint-disable-line
  //     const doc = parser.parseFromString(response.contents, 'application/xml');
  //     const jDoc = $(doc);
  //     const title = jDoc.find('channel>title');
  //     const titleText = title ? title.text() : undefined;

  //     const description = jDoc.find('channel>description');
  //     const descriptionText = description ? description.text() : undefined;

  //     addFeed({
  //       title: titleText,
  //       description: descriptionText,
  //       url
  //     });

  //     const items = jDoc.find('item');
  //     const articles = items.map(index => {
  //       const jItem = $(items[index]);
  //       const articleTitle = jItem.find('title');
  //       const link = jItem.find('link');
  //       return {
  //         title: articleTitle ? articleTitle.text() : undefined,
  //         link: link ? link.text() : undefined
  //       };
  //     });

  //     addArticles(articles);
  //   })
  //   .fail((jqxhr, textStatus, error) => {
  //     const err = `${textStatus}, ${error}`;
  //     console.log(`Request Failed: ${err}`);
  //   });
};

export default parseRSS;
