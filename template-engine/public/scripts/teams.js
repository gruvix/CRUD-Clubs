import { clearUsername } from './localStorage.js';

document.querySelector('#log-out-button').addEventListener('click', () => {
  clearUsername();
  window.location.href = '/';
});
