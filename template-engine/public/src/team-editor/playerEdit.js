import Player from '../../models/player.js';

function generateSquadPlayer(tableRow){
  const inputs = $(tableRow).children().children('input');
  const playerIndex = $(tableRow).attr('data-index');
  const values = {};
  inputs.each((index, input) => {
    const parameter = $(input).attr('data-parameter');
    const value = $(input).val();
    values[parameter] = value;
  });
  const player = new Player(values);
  const squad = { [playerIndex]: player };
  return squad;
}
/**
   * Updates the player of the team given the row of the values
   * @param {HTMLElement} - The row containing the player
   */
export default async function updatePlayer(tableRow) {
  console.log('updating player');
  const squadPlayer = generateSquadPlayer(tableRow);
  const updatedData = { squad: squadPlayer };
  const requestBody = JSON.stringify(updatedData);
  const teamId = $('#team-id').val();
  const response = await fetch(`/user/teams/${teamId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert('Error: could not update player');
  }
}
