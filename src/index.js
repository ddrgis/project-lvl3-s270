import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import startApplication from './js/app';

const settings = {
  rssUpdateInterval: 5000
};

startApplication(settings);
