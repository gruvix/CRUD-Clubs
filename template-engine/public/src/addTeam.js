import setupConfirmationModal from './confirmationModal.js';

$('#back-to-teams-button').on('click', () => {
  setupConfirmationModal('You are about to leave this page, team data will be lost', () => {
    window.location.href = '/user/teams';
  });
});
