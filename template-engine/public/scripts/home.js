import { saveUsername, loadUsername } from './localStorage.js';

function isLoggedIn() {
  return loadUsername() !== null;
}

function restoreSession() {
  if (isLoggedIn()) {
    const userName = loadUsername();
    window.location.href = `/user/${userName}/teams`;
  }
}

restoreSession();

document.querySelector('#enter-page-button').addEventListener('click', () => {
  const username = document.querySelector('#username').value.toLowerCase();
  const regexDefault = /^(?!default$).*$/;
  if(!regexDefault.test(username)) {
    $('#username-error').text('Username must not be "default"');
    $('#username-error').show();
    $('#username-error').delay(1500).fadeOut();
    return;
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    $('#username-error').text('Username may only contain letters');
    $('#username-error').show();
    $('#username-error').delay(1500).fadeOut();
    return;
  }
  saveUsername(username);
  window.location.href = `/user/${username}/teams`;
});
