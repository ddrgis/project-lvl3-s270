import $ from 'jquery';

export const renderFeedList = feeds => {
  const container = $('#rss-list');
  const content = `<dl>${feeds.map(
    feed => `<dt>${feed.title}</dt><dd>${feed.description}</dd>`
  )}</dl>`;
  container.html(content);
};

export const renderArticlesList = articles => {
  const container = $('#articles-list');
  const content = `<dl>${articles.map(
    a => `<dt>${a.title}</dt><dd>${a.link}</dd>`
  )}</dl>`;
  container.html(content);
};
