import setupConfirmationModal from './confirmationModal.js';


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
$('#teamTable').on('click', (event) => {
  if (event.target.classList.contains('edit')) {
    const tableRow = event.target.parentElement.parentElement;
    prepareEditField(tableRow);
    enableEditMode(tableRow);
  }
});
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
$('#upload-image-button').on('click', () => {
  const input = $('#image-input');
  input.trigger('click');
});
$('#image-input').on('change', (event) => {
  const file = event.target.files[0];
  uploadImage(file);
});
