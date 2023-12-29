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

function validateUsername(username) {
  const regexDefault = /^(?!default$).*$/;
  if (!regexDefault.test(username)) {
    return '"Default" is not available';
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    return 'Username may only contain letters';
  }
  else {
    return false;
  }
}
function login(username) {
  saveUsername(username);
  window.location.href = `/user/${username}/teams`;
};
function handleLogin() {
  const username = $('#username').val().toLowerCase();
  const error = validateUsername(username);
  if (!error) { 
    login(username);
  } else {
    showUsernameError(error);
  }
}

$('#enter-page-button').on('click', () => {
  handleLogin();
});
$('#username').on('keydown', (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
});
