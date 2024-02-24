import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeamCrest from '../shared/TeamCrest.jsx';
import ResetTeamButton from './ResetTeamButton.jsx';
import { webAppPaths } from '../../paths.js';
import TeamDataTable from './TeamDataTable.jsx';
import TeamsAdapter from '../adapters/TeamsAdapter.js';
import PlayersDataTable from './PlayersDataTable.jsx';
import ConfirmationModal from '../shared/ConfirmationModal.jsx';

export default function TeamEditor() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [teamParameters, setTeamParameters] = React.useState({});
  const [otherTeamData, setOtherTeamData] = React.useState({});
  const [players, setPlayers] = React.useState([]);
  const teamData = new TeamsAdapter();
  useEffect(() => {
    const updateTeamData = async () => {
      try {
        teamData.getTeamData(teamId)
          .then((data) => {
            if (!data.other.auth) {
              navigate(webAppPaths.home);
            } else {
              setTeamParameters(data.teamParameters);
              setOtherTeamData(data.other);
              setPlayers(data.players);
            }
          });
      } catch (error) {
        alert(error);
      }
    };
    updateTeamData();
  }, []);

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
            <TeamCrest teamCrest={otherTeamData.crestUrl} hasCustomCrest={otherTeamData.hasCustomCrest} className="team-crest-image" />
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
            <ResetTeamButton id={teamId} hasDefault={otherTeamData.hasDefault} />
          </div>
        </div>
      </div>

      <div className="row" id="tables">
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Team
          </strong>
          <div className="d-flex justify-content-center">
            <TeamDataTable teamData={teamParameters} teamId={teamId} />
          </div>
        </div>
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Players
          </strong>
          <div className="d-flex justify-content-center">
            <PlayersDataTable playersData={players} />
          </div>
        </div>
      </div>
      <input type="hidden" id="team-id" value={teamId} />
      <ConfirmationModal />
    </div>
  );
}
