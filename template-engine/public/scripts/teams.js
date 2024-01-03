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
async function resetTeams(callback) {
  await fetch('/user/reset/all', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
function logout() {
  clearUsername();
  fetch('/logout', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json()).then((data) => {
    if (data.redirectTo) {
      window.location.href = data.redirectTo;
    }
  });
}

$(() => {
  $('[data-toggle="tooltip"]').tooltip();
});
$('#log-out-button').on('click', () => {
  logout();
});

$('#reset-teams-button').on('click', () => {
  $('#modal-confirmation-text').text('You are about to reset all teams. All custom data (including new teams) will be lost');
  $('#confirmation-modal-button').on('click', () => {
    const callback = () => {
      window.location.href = '/user/teams';
    };
    resetTeams(callback);
  });
});
function goEditTeam(teamId) {
  window.location.href = `/user/teams/${teamId}`;
}
function deleteTeam(teamId) {
  fetch(`/user/teams/${teamId}`, {
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
