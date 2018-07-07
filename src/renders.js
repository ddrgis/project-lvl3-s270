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
  const articlesHtml = articles
    .map(
      a => `<div><a href="${a.link}" title="${a.title}">${a.title}</a></div>`
    )
    .join('');
  const content = `<div>${articlesHtml}</div>`;
  container.html(content);
};
