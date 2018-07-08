import $ from 'jquery';

export const parseRSS = (rss, url) => {
  const title = rss.find('channel>title');
  const titleText = title ? title.text() : undefined;
  const description = rss.find('channel>description');
  const descriptionText = description ? description.text() : undefined;
  const items = rss.find('item');
  const articles = items.map(index => {
    const jItem = $(items[index]);
    const articleTitle = jItem.find('title');
    const link = jItem.find('link'); // TODO: render it or delete if useless
    const articleDescription = jItem.find('description');
    return {
      title: articleTitle ? articleTitle.text() : undefined,
      link: link ? link.text() : undefined,
      description: articleDescription ? articleDescription.text() : undefined
    };
  });
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

