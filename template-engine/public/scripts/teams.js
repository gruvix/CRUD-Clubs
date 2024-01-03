import setupConfirmationModal from './confirmationModal.js';

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
async function logout() {
  const response = await fetch('/logout', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
}

$(() => {
  $('[data-toggle="tooltip"]').tooltip();
});
$('#log-out-button').on('click', () => {
  logout();
});

$('#reset-teams-button').on('click', () => {
  const confirmationText = 'You are about to reset all teams. All custom data (including new teams) will be lost';
  const callback = () => {
    window.location.reload();
  };
  setupConfirmationModal(confirmationText, () => {
    resetTeams(callback);
  });
});
function goEditTeam(teamId) {
  window.location.href = `/user/teams/${teamId}`;
}
async function deleteTeam(teamId) {
  const response = await fetch(`/user/teams/${teamId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (response.ok) {
    $(`#${teamId}`).parent().remove();
  }
  else {
    alert('Error: could not delete team');
  }
}
$('.edit').on('click', (event) => {
  goEditTeam(event.target.parentElement.id);
});
$('.delete').on('click', (event) => {
  deleteTeam(event.target.parentElement.id);
});
