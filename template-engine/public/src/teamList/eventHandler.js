import setupConfirmationModal from '../confirmationModal.js';
import deleteTeam from './deleteTeam.js';
import { toggleCardVisibility } from './queryController.js';
import resetTeams from './reset.js';
import logout from './userSession.js';

function adjustTitles() {
  const titles = document.querySelectorAll('h5');
  titles.forEach((title) => {
    if (title.offsetHeight > 50) {
      title.style.fontSize = '100%';
    }
  });
}
adjustTitles();
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
$('#add-team-button').on('click', (event) => {
  window.location.href = $(event.target).attr('href');
});
$('.edit').on('click', (event) => {
  const teamHref = $(event.target.parentElement).attr('href');
  window.location.href = teamHref;
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
$('#search-input').on('input', () => {
  const searchValue = $('#search-input').val().toLowerCase();
  $('.card-title').each((index, element) => {
    const teamName = $(element).text().toLowerCase();
    const card = $(element).parent().parent();
    const shouldShow = teamName.includes(searchValue);
    toggleCardVisibility(card, shouldShow);
  });
});
