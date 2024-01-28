import setupConfirmationModal from './confirmationModal.js';

function addPlayerRow() {
  const $table = $('#players-table');
  const $template = $('#new-player-template');
  const $newPlayerRow = $template.contents().clone(true);

  $($table).children('thead').children().first()
    .after($newPlayerRow);
}
function removePlayerRow(row) {
  $(row).remove();
}
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
