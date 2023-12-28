import { loadUsername } from './localStorage.js';

document.querySelector('#back-to-teams-button').addEventListener('click', () => {
  const username = loadUsername();
  window.location.href = `/user/${username}/teams`;
});

function prepareEditField(cell) {
  const text = $(cell).children('span').text();
  $(cell).children('input').val(text).show();
  $(cell).children('span').hide();
}

function applyEditField(cell) {
  const text = $(cell).children('input').val();
  $(cell).children('span').text(text).show();
  $(cell).children('input').hide();
}

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('edit')) {
    $(event.target).hide();
    $(event.target.parentElement.children[1]).show();
    prepareEditField(event.target.parentElement.parentElement.children[1]);
  }
});

function updateTeamParameter(cell) {
  const parameter = cell.id;
  const newValue = $(cell).children('input').val();
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

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('apply')) {
    $(event.target).hide();
    $(event.target.parentElement.children[0]).show();
    const targetCell = event.target.parentElement.parentElement.children[1];
    applyEditField(targetCell);
    updateTeamParameter(targetCell);
  }
});
