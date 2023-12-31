import { clearUsername, loadUsername } from './localStorage.js';

function resetTeams(username) {
  fetch(`/user/${username}/reset`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
$('#log-out-button').on('click', () => {
  clearUsername();
  window.location.href = '/';
});

$('#reset-teams-button').on('click', () => {
  const username = loadUsername();
  resetTeams(username);
});
