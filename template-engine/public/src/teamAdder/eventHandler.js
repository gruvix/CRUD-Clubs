import setupConfirmationModal from '../confirmationModal.js';
import { addPlayerRow, removePlayerRow, toggleUploadButton } from './queryController.js';
import submitTeamHandler from './submitTeam.js';

$('#back-to-teams-button').on('click', () => {
  setupConfirmationModal('You are about to leave this page, team data will be lost', () => {
    window.location.href = '/user/teams';
  });
});

$('#add-player-button').on('click', () => {
  addPlayerRow();
});
$('#players-table').on('click', (event) => {
  if (event.target.classList.contains('remove')) {
    removePlayerRow(event.target.parentElement.parentElement);
  }
});

$('#upload-image-button, #uploaded-image-button').on('click', () => {
  const input = $('#image-input');
  input.trigger('click');
});
$('#image-input').on('change', (event) => {
  const file = event.target.files[0];
  toggleUploadButton(file.name);
});
$('#submit-team-button').on('click', () => {
  submitTeamHandler();
});
