import { loadUsername } from './localStorage.js';

document.querySelector('#back-to-teams-button').addEventListener('click', () => {
  const username = loadUsername();
  window.location.href = `/user/${username}/teams`;
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
  $(buttons).children('.edit').hide();
  $(buttons).children('.apply').show();
  $(values).children('input').show();
  $(values).children('span').hide();
}
function disableEditMode(tableRow) {
  const values = tableRow.children[1];
  const buttons = tableRow.children[2];
  $(buttons).children('.edit').show();
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
function updateTeamParameter(tableRow) {
  const parameterCell = tableRow.children[1];
  const parameter = parameterCell.id;
  const newValue = $(parameterCell).children('input').val();
  const username = loadUsername();
  const teamId = $('#team-id').val();
  const updatedData = {};
  updatedData[parameter] = newValue;
  const requestBody = JSON.stringify(updatedData);

  fetch(`/user/${username}/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
}
function confirmEdit(tableRow) {
  disableEditMode(tableRow);
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
