import $ from 'jquery';

function parseFeed(rss) {
  const title = rss.find('channel>title');
  const titleText = title ? title.text() : '';
  const description = rss.find('channel>description');
  const descriptionText = description ? description.text() : '';
  return { titleText, descriptionText };
}

function parseArticles(items) {
  return items.map(index => {
    const jItem = $(items[index]);
    const articleTitle = jItem.find('title');
    const link = jItem.find('link');
    const articleDescription = jItem.find('description');
    return {
      title: articleTitle ? articleTitle.text() : '',
      link: link ? link.text() : '',
      description: articleDescription ? articleDescription.text() : ''
    };
  });
}

export const parseRSS = (rss, url) => {
  const { titleText, descriptionText } = parseFeed(rss);
  const items = rss.find('item');
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

export default parseRSS;
