import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeamCrest from '../shared/TeamCrest.jsx';
import ResetTeamButton from './ResetTeamButton.jsx';
import { webAppPaths } from '../../paths.js';
import TeamDataTable from './TeamDataTable.jsx';
import PlayersDataTable from './PlayersDataTable.jsx';
import ConfirmationModal from '../shared/ConfirmationModal.jsx';
import APIAdapter from '../adapters/APIAdapter.js';
import LoadingSpinner from '../shared/LoadingSpinner.jsx';

export default function TeamEditor() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [teamParameters, setTeamParameters] = React.useState({});
  const [otherTeamData, setOtherTeamData] = React.useState({});
  const [players, setPlayers] = React.useState([]);
  const [modalCallback, setModalCallback] = React.useState('');
  const [modalText, setModalText] = React.useState('');
  const [teamCrestUrl, setTeamCrestUrl] = React.useState(null);
  const request = new APIAdapter();
  const updateTeamData = async () => {
    try {
      setIsLoading(true);
      request.getTeamData(teamId)
        .then((data) => {
          if (data.redirect) {
            navigate(data.redirect);
          } else {
            setTeamParameters(data.teamParameters);
            setOtherTeamData(data.other);
            setPlayers(data.players);
            setTeamCrestUrl(data.other.crestUrl);
            setIsLoading(false);
          }
        });
    } catch (error) {
      alert(error);
    }
  };
  const resetTeam = () => async () => {
    request.resetTeam(teamId).then((data) => {
      if (data.redirect) {
        navigate(data.redirect);
      } else {
        updateTeamData();
      }
    });
  };
  useEffect(() => {
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
        {isLoading ? (
          <LoadingSpinner style={{
            marginLeft: '10rem', marginTop: '10rem', width: '7rem', height: '7rem',
          }}
          />
        ) : (

          <>
            <div className="col-4">
              <div className="d-flex justify-content-center img-container">
                <TeamCrest
                  teamCrest={teamCrestUrl}
                  hasCustomCrest={otherTeamData.hasCustomCrest}
                  className="team-crest-image"
                />
                <button
                  type="button"
                  className="btn btn-shadow overlay-button btn-outline-warning position-absolute top-50 start-50 translate-middle"
                  id="upload-image-button"
                  style={uploadImageButtonStyle}
                  onClick={() => document.getElementById('image-input').click()}
                >
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
                <ResetTeamButton
                  hasDefault={otherTeamData.hasDefault}
                  onClickCallback={() => {
                    setModalCallback(resetTeam);
                    setModalText('Are you sure you want to reset this team? All custom data will be lost and this action can not be undone');
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="row" id="tables">
        {isLoading ? (
          <LoadingSpinner style={{
            marginLeft: '10rem', marginTop: '10rem', width: '10rem', height: '10rem',
          }}
          />
        ) : (
          <div className="col">
            <strong className="d-flex justify-content-center text-warning table-title">
              Team
            </strong>
            <div className="d-flex justify-content-center">
              <TeamDataTable
                teamData={teamParameters}
                teamId={teamId}
                updateTeamCallback={updateTeamData}
              />
            </div>
          </div>
        )}
        {isLoading ? (
          <LoadingSpinner style={{
            marginLeft: '40rem', marginTop: '10rem', width: '10rem', height: '10rem',
          }}
          />
        ) : (

          <div className="col">
            <strong className="d-flex justify-content-center text-warning table-title">
              Players
            </strong>
            <div className="d-flex justify-content-center">
              <PlayersDataTable
                playersData={players}
                teamId={teamId}
                updateTeamCallback={updateTeamData}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal callback={modalCallback} confirmationText={modalText} />
    </div>
  );
}
