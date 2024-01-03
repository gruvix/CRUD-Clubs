export default function setupConfirmationModal(confirmationText, callback) {
  $('#modal-confirmation-text').text(confirmationText);
  $('#confirmation-modal-button').on('click', () => {
    callback();
  });
}
