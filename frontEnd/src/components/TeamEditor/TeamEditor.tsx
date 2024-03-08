import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TeamCrest from '../shared/TeamCrest';
import ResetTeamButton from './ResetTeamButton';
import { webAppPaths } from '../../paths.js';
import TeamDataTable from './TeamDataTable';
import PlayersDataTable from './PlayersDataTable';
import ConfirmationModal from '../shared/ConfirmationModal';
import APIAdapter, { RedirectData } from '../adapters/APIAdapter';
import LoadingSpinner from '../shared/LoadingSpinner';
import isImageTypeValid from '../shared/validateImage';
import Team from '../adapters/Team.js';

export default function TeamEditor() {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
  const [teamData, setTeamData] = React.useState({} as Team);
  const [modalCallback, setModalCallback] = React.useState(() => (): void => {});
  const [modalText, setModalText] = React.useState('');
  const request = new APIAdapter();
  const updateTeamData = async () => {
    try {
      setIsLoading(true);
      request.getTeamData(teamId)
        .then((data: RedirectData | Team) => {
          if ('redirect' in data) {
            navigate(data.redirect);
          } else {
            setTeamData(data);
            setIsLoading(false);
          }
        });
    } catch (error) {
      alert(error);
    }
  };
  const handleImageUpdate = (image: File) => {
    if (!isImageTypeValid(image)) {
      alert('Error: invalid image type');
    } else {
      request.updateTeamCrest(teamId, image).then((newCrestUrl) => {
        if (newCrestUrl.redirect) {
          navigate(newCrestUrl.redirect);
        } else {
          setTeamData((previousState) => ({...previousState, other: {...previousState.other, crestUrl: newCrestUrl}}));
        }
      });
    }
  };
  const resetTeam = () => async () => {
    request.resetTeam(teamId).then((data: RedirectData) => {
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <button
            type="button"
            className="btn btn-shadow btn-outline-warning"
            style={{ marginTop: '25px' }}
            onClick={() => navigate(webAppPaths.teams)}
            id="back-to-teams-button">
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
                  teamCrest={teamData.other.crestUrl}
                  className="team-crest-image"
                />
                <button
                  type="button"
                  className="btn btn-shadow overlay-button btn-outline-warning position-absolute top-50 start-50 translate-middle"
                  id="upload-image-button"
                  style={{ fontSize: '150%' }}
                  onClick={() => document.getElementById('image-input').click()}
                >
                  <span style={{ display: 'block' }}>
                    Upload new image
                  </span>
                  <span style={{ fontSize: '60%', display: 'block' }}>
                    jpeg / jpg / png / gif
                  </span>
                </button>
                <input
                  type="file"
                  id="image-input"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleImageUpdate(e.target.files[0]);
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="text-end">
                {teamData.other && (<ResetTeamButton
                  hasDefault={teamData.other.hasDefault}
                  onClickCallback={() => {
                    setModalCallback(resetTeam);
                    setModalText('Are you sure you want to reset this team? All custom data will be lost and this action can not be undone');
                  }}
                />)}
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
                teamData={teamData.teamParameters}
                teamId={Number(teamId)}
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
                playersData={teamData.players}
                teamId={Number(teamId)}
                setModalCallback = {setModalCallback}
                setModalText = {setModalText}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal callback={modalCallback} confirmationText={modalText} />
    </div>
  );
}
