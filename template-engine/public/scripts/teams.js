import { clearUsername, loadUsername } from './localStorage.js';

function adjustTitles() {
  const titles = document.querySelectorAll('h5');
  titles.forEach((title) => {
    if (title.offsetHeight > 50) {
      title.style.fontSize = '100%'; // Adjust size as needed
    }
  });
}
adjustTitles();
async function resetTeams(username, callback) {
  await fetch(`/user/${username}/reset`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
$(() => {
  $('[data-toggle="tooltip"]').tooltip();
});
$('#log-out-button').on('click', () => {
  clearUsername();
  window.location.href = '/';
});

$('#reset-teams-button').on('click', () => {
  $('#modal-confirmation-text').text('You are about to reset all teams. All custom data (including new teams) will be lost');
  $('#confirmation-modal-button').on('click', () => {
    const username = loadUsername();
    const callback = () => {
      window.location.href = `/user/${username}/teams`;
    };
    resetTeams(username, callback);
  });
});
function goEditTeam(teamId) {
  const username = loadUsername();
  window.location.href = `/user/${username}/teams/${teamId}`;
}
function deleteTeam(teamId) {
  const username = loadUsername();
  fetch(`/user/${username}/teams/${teamId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  $(`#${teamId}`).parent().remove();
}
$('.edit').on('click', (event) => {
  goEditTeam(event.target.parentElement.id);
});
$('.delete').on('click', (event) => {
  deleteTeam(event.target.parentElement.id);
});
