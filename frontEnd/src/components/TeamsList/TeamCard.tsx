import React from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCrest from '../shared/TeamCrest';
import { webAppPaths } from '../../paths.js';
import TeamCardClass from '../adapters/TeamCard';

interface TeamCardProps {
  team: TeamCardClass;
  deleteTeamCallback: (teamId: string | number, teamName: string) => void;
}

export default function TeamCard({ team, deleteTeamCallback }: TeamCardProps) {
  const navigate = useNavigate();
  const cardBodyStyle = {
    alignSelf: 'center',
  };
  const editButtonStyle = {
    marginRight: '10px',
  };
  return (
    <div className="card card-container">
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
