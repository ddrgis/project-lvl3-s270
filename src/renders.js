import $ from 'jquery';

export const renderFeedList = (feeds) => {
  const container = $('#rss-list');
  const content = `<dl>${feeds.map(feed => `<dt>${feed.title}</dt><dd>${feed.description}</dd>`)}</dl>`;
  container.html(content);
};

export default renderFeedList;
