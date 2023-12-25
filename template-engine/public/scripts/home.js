function loadUsername() {
  return localStorage.getItem('username');
}

function saveUsername(username) {
  localStorage.setItem('username', username);
}

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
  const userName = document.querySelector('#username').value.toLowerCase();
  saveUsername(userName);
  window.location.href = `/user/${userName}/teams`;
});
