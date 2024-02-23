import React from 'react';

export default function ConfirmationModal() {
  return (
    <div className="modal fade" id="confirmationModal" tabIndex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="confirmationModalLabel">Are you sure?</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <span id="modal-confirmation-text" />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-success" id="confirmation-modal-button" data-bs-dismiss="modal">Confirm</button>
            <button type="button" className="btn btn-outline-dark" id="cancel-modal-button" data-bs-dismiss="modal">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
