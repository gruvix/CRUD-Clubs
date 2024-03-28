import React from 'react';
import TeamCrest from '../../../components/shared/TeamCrest';
import { webAppPaths } from '../../../paths.js';
import TeamCardClass from '../../../components/adapters/TeamCard';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface TeamCardProps {
  team: TeamCardClass;
  visibility: boolean;
  deleteTeamCallback: (teamId: string | number, teamName: string) => void;
  router: AppRouterInstance;
}

export default function TeamCard({ team, visibility, deleteTeamCallback, router }: TeamCardProps) {
  return (
    <div className="card card-container" style={ visibility? { display: 'flex'} : { display: 'none' } }>
      <div className="card-header">
        <h5 className="card-title team-card-title">{team.name}</h5>
      </div>
      <TeamCrest teamCrest={team.crestUrl} className="list-team-crest-image" />
      <div className="card-body" style={{ alignSelf: 'center' }} id={team.id.toString()}>
        <button
          type="button"
          className="btn btn-outline-warning overlay-button-dark edit"
          onClick={() => router.push(`${webAppPaths.team(team.id)}`)}
          style={{ marginRight: '10px' }}
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
