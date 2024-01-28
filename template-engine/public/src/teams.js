import setupConfirmationModal from './confirmationModal.js';

function adjustTitles() {
  const titles = document.querySelectorAll('h5');
  titles.forEach((title) => {
    if (title.offsetHeight > 50) {
      title.style.fontSize = '100%';
    }
  });
}
adjustTitles();
async function resetTeams(callback) {
  const resetPath = $('#reset-teams-button').attr('href');
  await fetch(resetPath, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
async function logout() {
  const logoutPath = $('#log-out-button').attr('href');
  console.log(logoutPath);
  const response = await fetch(logoutPath, {
    method: 'post',
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
function goEditTeam(teamPath) {
  window.location.href = `${teamPath}`;
}
async function deleteTeam(teamPath, teamId) {
  const response = await fetch(`${teamPath}`, {
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
$('#add-team-button').on('click', (event) => {
  window.location.href = $(event.target).attr('href');
});
$('.edit').on('click', (event) => {
  const teamHref = $(event.target.parentElement).attr('href');
  goEditTeam(teamHref);
});
$('.delete').on('click', (event) => {
  const teamName = $(event.target).parent().parent().find('.team-card-title').text();
  const confirmationText = `You are about to delete ${teamName}. Custom teams are not recoverable`;
  const $buttonHolder = $(event.target.parentElement);
  const teamHref = $($buttonHolder).attr('href');
  const teamId = $($buttonHolder).attr('id');
  setupConfirmationModal(confirmationText, () => {
    deleteTeam(teamHref, teamId);
  });
});
function toggleCardVisibility(card, shouldShow) {
  if (shouldShow) {
    $(card).show();
  } else {
    $(card).hide();
  }
}
$('#search-input').on('input', () => {
  const searchValue = $('#search-input').val().toLowerCase();
  $('.card-title').each((index, element) => {
    const teamName = $(element).text().toLowerCase();
    const card = $(element).parent().parent();
    const shouldShow = teamName.includes(searchValue);
    toggleCardVisibility(card, shouldShow);
  });
});
