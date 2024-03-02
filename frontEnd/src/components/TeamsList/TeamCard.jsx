import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCrest from '../shared/TeamCrest.jsx';
import { webAppPaths } from '../../paths.js';

export default function TeamCard({ team, deleteTeamCallback }) {
  const navigate = useNavigate();
  const cardBodyStyle = {
    alignSelf: 'center',
  };
  const editButtonStyle = {
    marginRight: '10px',
  };
  return (
    <div className="card card-container" data-isdefaultteam={team.hasDefault}>
      <div className="card-header">
        <h5 className="card-title team-card-title">{team.name}</h5>
      </div>
      <TeamCrest teamCrest={team.crestUrl} className="list-team-crest-image" />
      <div className="card-body" style={cardBodyStyle} id={team.id}>
        <button
          type="button"
          className="btn btn-outline-warning overlay-button-dark edit"
          onClick={() => navigate(`${webAppPaths.team.replace(':teamId', team.id)}`)}
          style={editButtonStyle}
        >
          edit
        </button>
        <button
          type="button"
          className="btn btn-outline-danger overlay-button-dark delete"
          data-bs-toggle="modal"
          data-bs-target="#confirmationModal"
          onClick={() => deleteTeamCallback(team.id, team.name)}
        >
          delete
        </button>
      </div>
    </div>
  );
}
