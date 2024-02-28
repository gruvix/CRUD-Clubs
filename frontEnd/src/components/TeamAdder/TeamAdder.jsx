import React from 'react';

export default function TeamAdder() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <button
            type="button"
            className="btn btn-shadow btn-outline-warning"
            style={{ marginTop: '25px' }}
            id="back-to-teams-button"
            data-bs-toggle="modal"
            data-bs-target="#confirmationModal"
          >
            Go back
          </button>
        </div>
      </div>

      <div className="row" id="tables">
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Team
          </strong>
          <div className="d-flex justify-content-center">
            {/* {{> newTeamTable team=data.team }} */}
          </div>
        </div>
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Players
          </strong>
          <div className="d-flex justify-content-center">
            {/* {{> newTeamPlayersTable }} */}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="d-flex justify-content-center img-container">
          <button type="button" className="btn btn-shadow btn-outline-warning" id="upload-image-button" style={{ fontSize: '150%', marginBottom: '2%' }}>
            <div>
              <span style={{ display: 'block' }}>
                Upload Crest
              </span>
              <span style={{ fontSize: '60%', display: 'block' }}>
                jpeg / jpg / png / gif
              </span>
            </div>
          </button>

          <button type="button" className="btn btn-shadow btn-success" id="uploaded-image-button" style={{ fontSize: '150%', marginBottom: '2%', display: 'none' }}>
            <div style={{ display: 'block' }}>
              <div>
                Selected file:
              </div>
              <span style={{ fontSize: '60%', display: 'block' }}>
                image.png
              </span>
            </div>
          </button>

          <button type="button" className="btn btn-shadow btn-danger" id="invalid-image-button" style={{ fontSize: '150%', marginBottom: '2%', display: 'none' }}>
            <div style={{ display: 'block' }}>
              <div>
                Selected file:
              </div>
              <span style={{ fontSize: '60%', display: 'block' }}>
                INVALID FILE TYPE
              </span>
            </div>
          </button>

          <input type="file" id="image-input" style={{ display: 'none' }} />
        </div>
      </div>
      <div className="row">
        <div className="d-flex justify-content-center img-container">
          <button type="button" className="btn btn-shadow btn-outline-warning" id="submit-team-button" style={{ fontSize: '150%' }}>
            <span style={{ display: 'block' }}>
              Submit Team
            </span>
          </button>
        </div>
      </div>
      {/* {{> confirmationModal }} */}
    </div>
  );
}
