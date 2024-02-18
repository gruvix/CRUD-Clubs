/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton.jsx';
import getTeamsData from './teamsData.js';
import { webAppPaths } from '../../paths.js';
import TeamCard from './TeamCard.jsx';

function createTeamCards(teams) {
  return Object.keys(teams).map((key) => <TeamCard team={teams[key]} key={key} />);
}
export default function TeamsList() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [teamCards, setTeamCards] = React.useState('');

  useEffect(() => {
    const handleTeamsData = async () => {
      try {
        const teamsData = await getTeamsData();
        if (!teamsData.auth) {
          navigate(webAppPaths.home);
        } else {
          setUsername(teamsData.username);
          setTeamCards(createTeamCards(teamsData.teams));
        }
      } catch (error) {
        alert(error);
      }
    };
    handleTeamsData();
  });

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
          <LogoutButton style={logOutButtonStyle} text="Log out" />
          <span className="text-center teams-page-title">
            User:{' '}
            {username}
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
          <div className="container">
            <div className="row row-cols-5 justify-content-center">
              { teamCards }
            </div>
          </div>
        </div>
      </div>
      { /* confirmation modal */ }
    </div>
  );
}
