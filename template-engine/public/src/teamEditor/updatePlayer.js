import Player from '../../models/player.js';
import { disableEditMode, areInputsValid } from './queryController.js';

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
  const href = $('#players-table').attr('href');
  const response = await fetch(href, {
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
  const playerId = $(tableRow).attr('data-id');
  const requestBody = JSON.stringify({ playerId });
  const href = $('#players-table').attr('href');
  const response = await fetch(href, {
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
/**
   * Sends the player data to a POST endpoint
   * awaits a new id response, which introduces into a callback funtion when finished
   * @param {JSON} - new player data
   */
async function sendNewPlayer(player, callback) {
  const requestBody = JSON.stringify({ player });
  const href = $('#players-table').attr('href');
  const response = await fetch(href, {
    method: 'POST',
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
    const newId = await response.text();
    callback(newId);
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
  $($table).children('thead').children().first()
    .after($newPlayerRow);
  return $newPlayerRow;
}
function updatePlayerId(newId, tableRow) {
  $(tableRow).attr('data-id', newId);
}
export async function submitNewPlayer(tableRow) {
  if (!areInputsValid(tableRow)) return;
  disableEditMode();
  sendNewPlayer(generatePlayerObject(tableRow), (newId) => {
    const newRow = addNewPlayerRow(tableRow);
    updatePlayerId(newId, newRow);
  });
}
