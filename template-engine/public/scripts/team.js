import { loadUsername } from './localStorage.js';

document.querySelector('#back-to-teams-button').addEventListener('click', () => {
  const userName = loadUsername();
  window.location.href = `/user/${userName}/teams`;
});
