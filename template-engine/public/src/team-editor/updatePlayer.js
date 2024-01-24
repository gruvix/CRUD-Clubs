import Player from '../../models/player.js';
import { disableEditMode, areInputsValid } from './commonEdit.js';

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
export async function updatePlayer(tableRow) {
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
    alert(`Error ${response.status}: could not update player`);
  }
}
async function sendNewPlayersToServer(players, callback) {
  const teamId = $('#team-id').val();
  const requestBody = JSON.stringify({ players });
  const response = await fetch(`/user/teams/${teamId}/player`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert(`Error ${response.status}: could not add player`);
  } else {
    console.log('added player, server respondend OK cool');
    callback();
  }
}
/**
   * adds a new player to the player table, given the row of the values
   * @param {HTMLElement} - The add player row, containing new player's values
   */
function addNewPlayerRow(tableRow) {
  console.log('adding new player row');
  const $table = $('#players-table');
  const $template = $('#new-player-template');
  const $newPlayerRow = $template.contents().clone(true);

  $($newPlayerRow).find('span').each((index, span) => {
    $(span).text($(tableRow).find('input').eq(index).val());
  });
  const newIndex = $($table).find('.edit').length;
  console.log(newIndex);
  $($newPlayerRow).attr('data-index', newIndex);
  $table.children('thead').append($newPlayerRow);
}
export function submitNewPlayer(tableRow) {
  if (!areInputsValid(tableRow)) return;
  disableEditMode();
  sendNewPlayersToServer(generateSquadPlayer(tableRow), () => { addNewPlayerRow(tableRow); });
}
