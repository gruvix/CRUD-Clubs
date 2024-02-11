/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
// Use teams list eventHandler
export default function TeamsList() {
  const logOutButtonStyle = {
    marginTop: '15px',
  };
  const addTeamButtonStyle = {
    paddingButtom: '3%',
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <button type="button" className="btn btn-shadow btn-outline-warning" style={logOutButtonStyle} id="log-out-button" href="{{data.logoutPath}}">{ /* add log out path */ }log out</button>
          <span className="text-center teams-page-title">
            User:
            { /* user name */ }
          </span>
        </div>
      </div>

      <div className="row" style={addTeamButtonStyle}>
        <div className="col text-center">
          <button type="button" id="add-team-button" className="btn btn-shadow btn-outline-warning" href=""> { /* add team path */ }
            Add new team
          </button>
        </div>

        <div className="col text-center">
          <div className="input-group mb-3">
            <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="search-options-button">All teams</button>
            <ul className="dropdown-menu" id="search-options">
              <li><span className="dropdown-item">All teams</span></li>
              <li><span className="dropdown-item">Default teams</span></li>
              <li><span className="dropdown-item">Custom teams</span></li>
            </ul>
            <input id="search-input" type="text" className="form-control" aria-label="Text input with dropdown button" placeholder="Search teams..." />
          </div>
        </div>

        <div className="col text-center">
          <button
            type="button"
            id="reset-teams-button"
            className="btn btn-shadow btn-outline-danger"
            data-toggle="tooltip"
            data-placement="auto"
            title="Erase all teams and reload default teams"
            data-bs-toggle="modal"
            data-bs-target="#confirmationModal"
            href="{{data.resetTeamsPath}}"
          >
            Reset Teams
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          { /* team cards */ }
        </div>
      </div>
      { /* confirmation modal */ }
    </div>
  );
}
