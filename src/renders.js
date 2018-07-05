import $ from 'jquery';

export const renderFeedList = (feeds) => {
  const container = $('#rss-list');
  const content = feeds.map(feed => `<p>${feed}</p>`);
  container.html(content);
};

export default renderFeedList;
