import React from 'react';
import { useNavigate } from 'react-router-dom';
import { teamParametersKeys } from '../adapters/Team';
import { webAppPaths } from '../../paths';
import ConfirmationModal from '../shared/ConfirmationModal.jsx';

export default function TeamAdder() {
  const [playerSlots, setPlayerSlots] = React.useState([]);
  const navigate = useNavigate();
  function findNextAvailableSlot(slots) {
    let nextSlot = 1;
    while (slots.includes(nextSlot)) {
      nextSlot += 1;
    }
    return nextSlot;
  }
  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <button
            type="button"
            className="btn btn-shadow btn-outline-warning"
            style={{ marginTop: '25px' }}
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
            <table className="table" id="team-table">
              <thead>
                {teamParametersKeys.map((key) => (
                  <tr className="table-dark table-bordered">
                    <td className="text-warning" style={{ textTransform: 'capitalize', paddingTop: '3.5%' }}>{key}</td>
                    <td aria-label={key}>
                      <input type="text" className="form-control" value="" />
                    </td>
                  </tr>
                ))}
              </thead>
            </table>
          </div>
        </div>
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Players
          </strong>
          <div className="d-flex justify-content-center">

            <div style={{ height: '410px', overflow: 'auto' }}>
              <table className="table" id="players-table">
                <thead>
                  <tr className="table-dark" id="add-player-row">
                    <td className="text-warning">
                      Name
                    </td>
                    <td className="text-warning">
                      Position
                    </td>
                    <td className="text-warning">
                      Nationality
                    </td>
                    <td style={{ display: 'flex', minHeight: '80px', paddingTop: '20px' }}>
                      <button
                        type="button"
                        className="btn btn-shadow btn-outline-warning"
                        id="add-player-button"
                        style={{ maxHeight: '40px', minWidth: '120px' }}
                        onClick={() => {
                          const nextAvailableSlot = findNextAvailableSlot(playerSlots);
                          setPlayerSlots([...playerSlots, nextAvailableSlot]);
                        }}
                      >
                        Add player
                      </button>
                    </td>
                  </tr>
                  {playerSlots.map((slot) => (
                    <tr className="table-dark table-bordered player" key={slot}>
                      <td aria-label="name">
                        <input type="text" className="form-control" value="" data-parameter="name" />
                      </td>
                      <td aria-label="position">
                        <input type="text" className="form-control" value="" data-parameter="position" />
                      </td>
                      <td aria-label="nationality">
                        <input type="text" className="form-control" value="" data-parameter="nationality" />
                      </td>
                      <td className="buttons-column" style={{ display: 'flex', minHeight: '42px' }}>
                        <button
                          type="button"
                          className="btn btn-outline-danger remove"
                          onClick={() => setPlayerSlots(playerSlots.filter((s) => s !== slot))}
                        >
                          remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            </div>

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
      <ConfirmationModal callback={() => navigate(webAppPaths.teams)} confirmationText="Are you sure you want to leave? all data will be lost" />
    </div>
  );
}
