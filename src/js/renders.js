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

export const renderRSSModal = (title, description) => {
  console.log('111');
  console.log(title);
  $('#rss-modal-label').html(title);
  $('#rss-modal-body').html(description);
  $('#rss-modal').modal('show');
};

export const renderArticlesList = articles => {
  const container = $('#articles-list');
  const articlesItems = articles.map(a => {
    const span = document.createElement('span');
    span.setAttribute('data-toggle', 'modal');
    span.setAttribute('data-target', '#rss-modal');
    span.innerHTML = a.title;
    span.addEventListener(
      'click',
      renderRSSModal.bind(this, a.title, a.description)
    );
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.appendChild(span);

    return li;
  });

  const ul = document.createElement('ul');
  ul.setAttribute('class', 'list-group');
  articlesItems.forEach(a => {
    ul.appendChild(a);
  });

  const div = document.createElement('div');
  div.appendChild(ul);
  container.html(div);
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
