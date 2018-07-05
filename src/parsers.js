import axios, { get } from 'axios';

const parseRSS = (url) => {
  get(`https://crossorigin.me/${url}`)
    .then((response) => {
      console.log('First:');
      console.log(response);
    })
    .catch((error) => {
      console.log('First:');
      console.log(error);
    });

  const instance = axios.create({
    baseURL: 'https://crossorigin.me/',
    timeout: 31000,
    Origin: 'https://crossorigin.me/',
  });

  instance.get(url)
    .then((response) => {
      console.log('Second:');
      console.log(response);
    })
    .catch((error) => {
      console.log('Second:');
      console.log(error);
    });
};

export default parseRSS;
