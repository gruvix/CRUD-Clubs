/// <reference types="jquery" />

import setupConfirmationModal from '../confirmationModal.js';
import updateTeamParameter from './updateTeam.js';
import { updatePlayer, submitNewPlayer, removePlayer } from './updatePlayer.js';
import resetTeam from './reset.js';
import handleImageUpdate from './updateCrest.js';
import * as common from './commonEdit.js';

$('#back-to-teams-button').on('click', (event) => {
  window.location.href = $(event.target).attr('href');
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
  const buttonClassList = event.target.classList;
  if (buttonClassList.contains('apply')) {
    const tableRow = event.target.parentElement.parentElement;
    handleApplyAction(tableRow);
  }
  if (buttonClassList.contains('cancel')) {
    common.disableEditMode();
  }
  if (buttonClassList.contains('remove')) {
    const playerRow = event.target.parentElement.parentElement;
    const playerName = $(playerRow).children().children('span').first()
      .text();
    const confirmationText = `You are about to remove ${playerName}`;
    setupConfirmationModal(confirmationText, () => {
      removePlayer(playerRow);
    });
  }
});
$('#tables').on('keydown', (event) => {
  if (event.key === 'Enter') {
    if (event.target.parentElement.parentElement.id !== 'add-player-row') {
      const playerRow = event.target.parentElement.parentElement;
      handleApplyAction(playerRow);
    } else {
      submitNewPlayer($('#add-player-row'));
    }
  }
});
$('#confirm-player-button').on('click', () => {
  submitNewPlayer($('#add-player-row'));
});
$('#cancel-player-button').on('click', () => {
  common.disableEditMode();
});
$('#tables').on('keydown', (event) => {
  if (event.key === 'Escape') {
    common.disableEditMode();
  }
});
$('#add-player-button').on('click', (event) => {
  const tableRow = event.target.parentElement.parentElement;
  common.prepareEditFields(tableRow);
  common.enableEditMode(tableRow);
});
