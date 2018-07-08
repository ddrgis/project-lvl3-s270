import $ from 'jquery';

export const renderFeedList = feeds => {
  const container = $('#rss-list');
  const feedItems = feeds.map(
    feed => `<div class="list-group-item">
      <h5>${feed.title}</h5>
      <p>${feed.description}</p>
    </div>`
  );
  const content = `<ul class="list-group">${feedItems}</ul>`;
  container.html(content);
};

export const renderArticlesList = articles => {
  const container = $('#articles-list');
  const articlesItems = articles
    .map(
      a => `<li class="list-group-item">
              <a href="${a.link}" title="${a.title}">${a.title}</a>
            </li>`
    )
    .join('');
  const articlesHtml = `<ul class="list-group">${articlesItems}</ul>`;
  const content = `<div>${articlesHtml}</div>`;
  container.html(content);
};

export const renderValidationError = error => {
  const container = $('#rss-input-error');
  container.html(error);
};

export const toggleRSSInputLoader = isLoading => {
  const loader = $('#rss-input-loader');
  if (isLoading) {
    loader.show();
  } else {
    loader.hide();
  }
};

export const hideRSSContent = () => {
  const container = $('#rss-container');
  container.hide();
};

export const showRSSContent = () => {
  const container = $('#rss-container');
  container.show();
};
