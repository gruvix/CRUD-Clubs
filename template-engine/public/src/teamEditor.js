import setupConfirmationModal from './confirmationModal.js';

async function resetTeam(callback) {
  const teamId = $('#team-id').val();
  await fetch(`/user/reset/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}

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
function prepareEditField(tableRow) {
  const values = tableRow.children[1];
  const text = $(values).children('span').text();
  $(values).children('input').val(text);
}

function applyEditField(tableRow) {
  const values = tableRow.children[1];
  const text = $(values).children('input').val();
  $(values).children('span').text(text);
}
function enableEditMode(tableRow) {
  const values = tableRow.children[1];
  const buttons = tableRow.children[2];
  $('.edit').hide();
  $(buttons).children('.apply').show();
  $(values).children('input').show().trigger('focus')
    .trigger('select');
  $(values).children('span').hide();
}
function disableEditMode(tableRow) {
  const values = tableRow.children[1];
  const buttons = tableRow.children[2];
  $('.edit').show();
  $(buttons).children('.apply').hide();
  $(values).children('input').hide();
  $(values).children('span').show();
}

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('edit')) {
    const tableRow = event.target.parentElement.parentElement;
    prepareEditField(tableRow);
    enableEditMode(tableRow);
  }
});
/**
 * Updates the parameter of the team given the row of the value
 * @param {HTMLElement} - The row containing the parameter
 */
async function updateTeamParameter(tableRow) {
  const parameterCell = tableRow.children[1];
  const parameter = parameterCell.id;
  const newValue = $(parameterCell).children('input').val();
  const teamId = $('#team-id').val();
  const updatedData = {};
  updatedData[parameter] = newValue;
  const requestBody = JSON.stringify(updatedData);

  const response = await fetch(`/user/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert('Error: could not update team');
  }
}
function isInputEqualToValid(tableRow) {
  const values = tableRow.children[1];
  const text = $(values).children('input').val();
  const validText = $(values).children('span').text();
  return text === validText;
}
function confirmEdit(tableRow) {
  disableEditMode(tableRow);
  if (isInputEqualToValid(tableRow)) return;
  applyEditField(tableRow);
  updateTeamParameter(tableRow);
}

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('apply')) {
    confirmEdit(event.target.parentElement.parentElement);
  }
});
$('#teamTable').on('keydown', (event) => {
  if (event.key === 'Enter') {
    confirmEdit(event.target.parentElement.parentElement);
  }
});
function uploadImage(image) {
  const teamId = $('#team-id').val();
  fetch(`/user/${teamId}/upload`, {
    method: 'POST',
    body: image,
  });
}
$('#upload-image-button').on('click', () => {
  const input = $('#image-input');
  input.trigger('click');
});
$('#image-input').on('change', (event) => {
  const file = event.target.files[0];
  uploadImage(file);
});
