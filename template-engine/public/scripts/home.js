document.querySelector('#enter-page-button').addEventListener('click', () => {
  const userName = document.querySelector('#username').value.toLowerCase();
  window.location.href = `/user/${userName}/teams`;
});
