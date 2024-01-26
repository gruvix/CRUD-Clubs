import Player from '../../models/player.js';
import { disableEditMode, areInputsValid } from './commonEdit.js';

function generatePlayerObject(tableRow) {
  const inputs = $(tableRow).children().children('input');
  const playerId = $(tableRow).attr('data-id');
  const values = { id: playerId };
  inputs.each((index, input) => {
    const parameter = $(input).attr('data-parameter');
    const value = $(input).val();
    values[parameter] = value;
  });
  const player = new Player(values);
  return player;
}
/**
   * Updates the player of the team given the row of the values
   * @param {HTMLElement} - The row containing the player
   */
export async function updatePlayer(tableRow) {
  const player = generatePlayerObject(tableRow);
  const updatedData = { player };
  const requestBody = JSON.stringify(updatedData);
  const teamId = $('#team-id').val();
  const response = await fetch(`/user/teams/${teamId}/player`, {
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
function removePlayerRow(playerRow) {
  $(playerRow).remove();
}
export async function removePlayer(tableRow) {
  const teamId = $('#team-id').val();
  const playerId = $(tableRow).attr('data-id');
  const requestBody = JSON.stringify({ playerId });
  const response = await fetch(`/user/teams/${teamId}/player`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert(`Error ${response.status}: could not remove player`);
  } else {
    removePlayerRow(tableRow);
  }
}
async function sendNewPlayers(player, callback) {
  const teamId = $('#team-id').val();
  const requestBody = JSON.stringify({ player });
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
    callback();
  }
}
/**
   * adds a new player to the player table, given the row of the values
   * @param {HTMLElement} - The add player row, containing new player's values
   */
function addNewPlayerRow(tableRow) {
  const $table = $('#players-table');
  const $template = $('#new-player-template');
  const $newPlayerRow = $template.contents().clone(true);

  $($newPlayerRow).find('span').each((index, span) => {
    $(span).text($(tableRow).find('input').eq(index).val());
  });
  const newIndex = $($table).find('.edit').length;
  console.log(newIndex);
  $($newPlayerRow).attr('data-index', newIndex);
  $($table).children('thead').children().first()
    .after($newPlayerRow);
}
export function submitNewPlayer(tableRow) {
  if (!areInputsValid(tableRow)) return;
  disableEditMode();
  sendNewPlayers(generatePlayerObject(tableRow), () => { addNewPlayerRow(tableRow); });
}
