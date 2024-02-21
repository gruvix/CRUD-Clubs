import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeamCrest from '../shared/TeamCrest.jsx';
import ResetTeamButton from './ResetTeamButton.jsx';
import { webAppPaths } from '../../paths.js';

export default function TeamEditor() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [team, setTeam] = React.useState({ id: null, hasDefault: false, hasCustomCrest: false });

  const goBackButtonStyle = {
    marginTop: '25px',
  };
  const uploadImageSpanStyle = {
    display: 'block',
  };
  const uploadImageButtonStyle = {
    fontSize: '150%',
  };
  const imageAllowedTypesStyle = {
    fontSize: '60%',
    display: 'block',
  };
  const hiddenImageInputStyle = {
    display: 'none',
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <button type="button" className="btn btn-shadow btn-outline-warning" style={goBackButtonStyle} onClick={() => navigate(webAppPaths.teams)} id="back-to-teams-button">
            Go back
          </button>
        </div>

        <div className="col-4">
          <div className="d-flex justify-content-center img-container">
            <TeamCrest teamCrest={team.crestUrl} hasCustomCrest={team.hasCustomCrest} className="team-crest-image" />
            <button type="button" className="btn btn-shadow overlay-button btn-outline-warning position-absolute top-50 start-50 translate-middle" id="upload-image-button" style={uploadImageButtonStyle}>
              <span style={uploadImageSpanStyle}>
                Upload new image
              </span>
              <span style={imageAllowedTypesStyle}>
                jpeg / jpg / png / gif
              </span>
            </button>
            <input type="file" id="image-input" style={hiddenImageInputStyle} />
          </div>
        </div>

        <div className="col">
          <div className="text-end">
            <ResetTeamButton id={teamId} hasDefault={team.hasDefault} />
          </div>
        </div>
      </div>

      <div className="row" id="tables">
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Team
          </strong>
          <div className="d-flex justify-content-center">
            {/* teamTable team=data.team path=data.teamPath id=data.id */}
          </div>
        </div>
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Players
          </strong>
          <div className="d-flex justify-content-center">
            {/* playersTable players=data.players path=data.playerPath id=data.id */}
          </div>
        </div>
      </div>
      <input type="hidden" id="team-id" value={teamId} />
    </div> /* confirmationModal */
  );
}
