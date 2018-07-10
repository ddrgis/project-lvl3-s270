import $ from 'jquery';

export const renderFeedList = feeds => {
  const container = document.getElementById('feed-list-container');
  const feedItems = feeds.map(
    feed =>
      `<div class="list-group-item">
      <h5>${feed.title}</h5>
      <p>${feed.description}</p>
    </div>`
  );
  const content = `<ul class="list-group">${feedItems}</ul>`;
  container.innerHTML = content;
};

export const renderRSSModal = ({ title, description, link }) => {
  $('#rss-modal-label').html(title);
  $('#rss-modal-body')
    .html(`<p class="lead">${description}</p>`)
    .append(
      `<br/><small class="text-muted"><a href='${link}' title='${title}'>Source: ${link}</a></small>`
    );
  $('#rss-modal').modal('show');
};

const renderArticle = a => {
  const link = document.createElement('a');
  link.setAttribute('href', '');
  link.setAttribute('title', a.title);
  link.setAttribute('data-toggle', 'modal');
  link.setAttribute('data-target', '#rss-modal');
  link.setAttribute('class', 'articles-list-item');
  link.innerHTML = a.title;
  link.addEventListener('click', renderRSSModal.bind(this, a));
  const li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  li.appendChild(link);
  return li;
};

// TODO: sorting of articles
const appendArticlesToContainer = (articles, container) => {
  const articlesItems = articles.map(article => renderArticle(article));
  articlesItems.forEach(acticle => {
    container.appendChild(acticle);
  });
};

const getNewArticles = (oldArticles, articles) => {
  const oldArticlesArray = Array.from(oldArticles);
  const newArticles = articles.filter(
    article =>
      !oldArticlesArray.some(oldArticle => oldArticle.title === article.title)
  );
  return newArticles;
};

export const renderArticlesListNew = articles => {
  const container = document.getElementById('articles-list-container');
  const renderedArticles = container.getElementsByClassName(
    'articles-list-item'
  );
  if (renderedArticles.length === 0) {
    const ul = document.createElement('ul');
    ul.setAttribute('class', 'list-group');
    ul.setAttribute('id', 'articles-list');
    appendArticlesToContainer(articles, ul);
    const div = document.createElement('div');
    div.appendChild(ul);
    container.appendChild(div);
  } else {
    const newArticles = getNewArticles(renderedArticles, articles);
    const listContainer = document.getElementById('articles-list');
    appendArticlesToContainer(newArticles, listContainer);
  }
};

export const renderValidationError = error => {
  const container = $('#rss-input-error');
  const rssURLInput = $('#input-rss-url');

  if (error) {
    rssURLInput.addClass('border border-danger');
  } else {
    rssURLInput.removeClass('border border-danger');
  }

  container.html(error);
};

export const toggleRSSLoading = isLoading => {
  const loader = $('#rss-input-loader');
  if (isLoading) {
    loader.removeClass('invisible');
    loader.addClass('visible');
  } else {
    loader.removeClass('visible');
    loader.addClass('invisible');
  }
  $('#btn-submit').prop('disabled', (index, value) => !value);
};

export const showContentContainer = () => {
  const container = $('#rss-container');
  container.removeClass('invisible');
  container.addClass('visible');
};
