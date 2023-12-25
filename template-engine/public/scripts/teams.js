document.querySelector('#log-out-button').addEventListener('click', () => {
  localStorage.removeItem('username');
  window.location.href = '/';
});
