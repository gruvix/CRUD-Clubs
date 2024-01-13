import setupConfirmationModal from '../confirmationModal.js';
import * as team from './teamEdit.js';
import resetTeam from '../teams.js';
import uploadImage from './crest.js';

$('#back-to-teams-button').on('click', () => {
  window.location.href = '/user/teams';
});

$(() => {
  $('[data-toggle="tooltip"]').tooltip();
});

$('#reset-team-button').on('click', () => {
  const confirmationText = 'You are about to reset the team. All custom data will be lost';
  setupConfirmationModal(confirmationText, () => {
    const callback = () => {
      window.location.reload();
    };
    resetTeam(callback);
  });
});

$('#upload-image-button').on('click', () => {
  const input = $('#image-input');
  input.trigger('click');
});
$('#image-input').on('change', (event) => {
  const file = event.target.files[0];
  uploadImage(file);
});

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('edit')) {
    const tableRow = event.target.parentElement.parentElement;
    team.prepareEditField(tableRow);
    team.enableEditMode(tableRow);
  }
});

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('apply')) {
    team.confirmEdit(event.target.parentElement.parentElement);
  }
});
$('#teamTable').on('keydown', (event) => {
  if (event.key === 'Enter') {
    team.confirmEdit(event.target.parentElement.parentElement);
  }
});


