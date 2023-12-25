import { loadUsername } from './localStorage.js';

document.querySelector('#back-to-teams-button').addEventListener('click', () => {
  const userName = loadUsername();
  window.location.href = `/user/${userName}/teams`;
});

function prepareEditField(target) {
  const text = $(target).children('span').text();
  $(target).children('input').val(text).show();
  $(target).children('span').hide();
}

function applyEditField(target) {
  const input = $(target).children('input').val();
  $(target).children('span').text(input).show();
  $(target).children('input').hide();
}

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('btn-outline-warning')) {
    $(event.target).hide();
    $(event.target.parentElement.children[1]).show();
    prepareEditField(event.target.parentElement.parentElement.children[1]);
  }
});

$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('btn-outline-success')) {
    $(event.target).hide();
    $(event.target.parentElement.children[0]).show();
    applyEditField(event.target.parentElement.parentElement.children[1]);
  }
});
