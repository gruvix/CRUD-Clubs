import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { webAppPaths } from '../../paths.js';
import TeamCardComponent from './TeamCard';
import APIAdapter, { RedirectData } from '../adapters/APIAdapter';
import ConfirmationModal from '../shared/ConfirmationModal';
import LoadingSpinner from '../shared/LoadingSpinner';
import TeamCard from '../adapters/TeamCard.js';

interface TeamsData {
  username: string;
  teams: TeamCard[];
}

export default function TeamsList(): React.ReactElement {
  const navigate = useNavigate();
  const [searchOption, setSearchOption] = React.useState('All teams');
  const [searchPattern, setSearchPattern] = React.useState('');
  const [shouldTeamShow, setShouldTeamShow] = React.useState<boolean[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [username, setUsername] = React.useState('');
  const [teamCards, setTeamCards] = React.useState<TeamCard[]>({} as TeamCard[]);
  const [modalCallback, setModalCallback] = React.useState(() => (): void => {});
  const [modalText, setModalText] = React.useState('');
  const request = new APIAdapter();

  const updateTeamsData = async () => {
    try {
      setIsLoading(true);
      request.getTeamsData().then((data: TeamsData | RedirectData) => {
        if ('redirect' in data) {
          navigate(data.redirect);
        } else {
          setUsername(data.username);
          setTeamCards(data.teams);
          setIsLoading(false);
        }
      });
    } catch (error) {
      alert(error);
    }
  };
  const deleteTeam = (teamId: number) => async () => {
    request.deleteTeam(teamId).then((data: RedirectData) => {
      if (data.redirect) {
        navigate(data.redirect);
      } else {
        updateTeamsData();
      }
    });
  };
  const setUpDeleteTeamModal = (teamId: number, teamName: string) => {
    setModalCallback(() => deleteTeam(teamId));
    setModalText(`Are you sure you want to delete team ${teamName}?`);
  };
  const resetTeams = () => async () => {
    request.resetTeamsList().then((data: RedirectData) => {
      if (data.redirect) {
        navigate(data.redirect);
      } else {
        updateTeamsData();
      }
    });
  };
  useEffect(() => {
    updateTeamsData();
  }, []);
  useEffect(() => {
    setShouldTeamShow(Object.keys(teamCards).map((teamIndex) => {
      const team  = teamCards[Number(teamIndex)];
      if ( team.name.toString().toLowerCase().includes(searchPattern.toLowerCase()) ) {
        switch (searchOption) {
          case 'All teams':
            return true;
          case 'Default teams':
            return team.isDefault;
          case 'Custom teams':
            return !team.isDefault;            
        }
      }
    }));
  }, [searchPattern, searchOption, teamCards]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <LogoutButton style={{ marginTop: '15px' }} text="Log out" />
          <span className="text-center teams-page-title">
            User:{' '}
            {username}
          </span>
        </div>
      </div>

      <div className="row" style={{ paddingBottom: '3%' }}>
        <div className="col text-center">
          <button type="button" id="add-team-button" className="btn btn-shadow btn-outline-warning" onClick={() => navigate(webAppPaths.addTeam)}>
            Add new team
          </button>
        </div>

        <div className="col text-center">
          <div className="input-group mb-3">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="search-options-button">
              {searchOption}
            </button>
            <ul
              className="dropdown-menu"
              id="search-options"
              onClick={(e) => setSearchOption('textContent' in e.target ? e.target.textContent as string : 'All teams')}
            >
              <li><span data-search-option="all" className="dropdown-item">All teams</span></li>
              <li><span data-search-option="default" className="dropdown-item">Default teams</span></li>
              <li><span data-search-option="custom" className="dropdown-item">Custom teams</span></li>
            </ul>
            <input
              id="search-input"
              type="text" className="form-control"
              aria-label="Text input with dropdown button"
              value={searchPattern}
              placeholder="Search teams..."
              onChange={(e) => setSearchPattern(e.target.value)}
            />
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
            onClick={() => {
              setModalCallback(resetTeams);
              setModalText('Are you sure you want to reset all teams? All custom data will be lost and this action can not be undone');
            }}
          >
            Reset Teams
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="container">
            <div className="row row-cols-5 justify-content-center">
              {isLoading
                ? (<LoadingSpinner style={{ marginTop: '10%', height: '20rem', width: '20rem' }} />)
                : Object.keys(teamCards).map((key: string, index) => (
                  <TeamCardComponent
                    team={teamCards[Number(key)]}
                    key={key}
                    deleteTeamCallback={setUpDeleteTeamModal}
                    visibility={shouldTeamShow[index]}
                  />
                )) }
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal callback={modalCallback} confirmationText={modalText} />
    </div>
  );
}
