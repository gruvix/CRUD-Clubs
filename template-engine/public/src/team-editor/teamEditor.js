/// <reference types="jquery" />

import setupConfirmationModal from '../confirmationModal.js';
import updateTeamParameter from './teamEdit.js';
import updatePlayer from './playerEdit.js';
import resetTeam from './reset.js';
import handleImageUpdate from './crest.js';
import * as common from './commonEdit.js';

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
  handleImageUpdate(file);
});

$('#tables').on('click', (event) => {
  if (event.target.classList.contains('edit')) {
    const tableRow = event.target.parentElement.parentElement;
    common.prepareEditFields(tableRow);
    common.enableEditMode(tableRow);
  }
});
function handleApplyAction(tableRow) {
  const table = $(tableRow).parent().parent().attr('id');
  let callback;
  switch (table) {
    case 'team-table':
      callback = updateTeamParameter;
      break;
    case 'players-table':
      callback = updatePlayer;
      break;
    default:
      callback = () => {};
      break;
  }
  common.submitChanges(tableRow, callback);
}
$('#tables').on('click', (event) => {
  if (event.target.classList.contains('apply')) {
    const tableRow = event.target.parentElement.parentElement;
    handleApplyAction(tableRow);
  }
});
$('#tables').on('keydown', (event) => {
  if (event.key === 'Enter') {
    const tableRow = event.target.parentElement.parentElement;
    handleApplyAction(tableRow);
  }
});
