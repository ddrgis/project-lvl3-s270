function parseFeed(rss) {
  const title = rss.querySelector('channel>title');
  const titleText = title ? title.textContent : '';
  const description = rss.querySelector('channel>description');
  const descriptionText = description ? description.textContent : '';
  return { titleText, descriptionText };
}

function parseArticles(items) {
  return items.map(item => {
    const articleTitle = item.querySelector('title');
    const link = item.querySelector('link');
    const articleDescription = item.querySelector('description');
    return {
      title: articleTitle ? articleTitle.textContent : '',
      link: link ? link.textContent : '',
      description: articleDescription ? articleDescription.textContent : ''
    };
  });
}

export const parseRSS = (rss, url) => {
  const { titleText, descriptionText } = parseFeed(rss);
  const items = [...rss.querySelectorAll('item')];
  const articles = parseArticles(items);

  return {
    feed: {
      title: titleText,
      description: descriptionText,
      url
    },
    articles
  };
};

export const parseDocument = (string, format = 'application/xml') => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(string, format);
  return dom;
};
