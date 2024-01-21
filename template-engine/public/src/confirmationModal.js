function clearConfirmationModal() {
 $('#confirmation-modal-button').off('click');
}
export default function setupConfirmationModal(confirmationText, callback) {
  clearConfirmationModal();
  $('#modal-confirmation-text').text(confirmationText);
  $('#confirmation-modal-button').on('click', () => {
    callback();
  });
}
