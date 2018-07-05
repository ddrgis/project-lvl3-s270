import axios, { get } from 'axios';

const parseRSS = (url) => {
  const instance = axios.create({
    baseURL: 'https://crossorigin.me/',
    timeout: 20000,
    Origin: 'https://crossorigin.me/',
  });

  console.log('First:');
  get(`https://crossorigin.me/${url}`)
    .then(response => console.log(response))
    .catch(error => console.log(error));

  console.log('Second:');
  instance.get(url)
    .then(response => console.log(response))
    .catch(error => console.log(error));
};

export default parseRSS;
