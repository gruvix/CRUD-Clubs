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

function showUsernameError(error){
  $('#username-error').text(error);
  $('#username-error').show();
  $('#username-error').delay(1500).fadeOut();
}

restoreSession();

document.querySelector('#enter-page-button').addEventListener('click', () => {
  const username = document.querySelector('#username').value.toLowerCase();

  const regexDefault = /^(?!default$).*$/;
  if (!regexDefault.test(username)) {
    showUsernameError('"Default" is not available');
    return;
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    showUsernameError('Username may only contain letters');
    return;
  }
  saveUsername(username);
  window.location.href = `/user/${username}/teams`;
});
