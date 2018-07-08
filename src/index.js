import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import app from './app';

import styles from '../public/styles.css'; // eslint-disable-line

const rssUpdateInterval = 5000;

app({ rssUpdateInterval });
