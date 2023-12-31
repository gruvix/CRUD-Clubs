import { clearUsername, loadUsername } from './localStorage.js';

async function resetTeams(username, callback) {
  await fetch(`/user/${username}/reset`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
$('#log-out-button').on('click', () => {
  clearUsername();
  window.location.href = '/';
});

$('#reset-teams-button').on('click', () => {
  const username = loadUsername();
  const callback = () => {
    window.location.href = `/user/${username}/teams`;
  };
  resetTeams(username, callback);
});
