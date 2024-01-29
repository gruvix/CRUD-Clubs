import Player from '../../models/player.js';
import Team from '../../models/team.js';

function getImageFile() {
  return $('#image-input').prop('files')[0];
}
async function sendData(teamData, callback) {
  const preparedData = JSON.stringify({ teamData });
  const href = $('#submit-team-button').attr('href');
  const response = await fetch(href, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: preparedData,
  });
  if (!response.ok) {
    alert(`Error ${response.status}: could not add team`);
  } else {
    callback();
  }
  if (response.redirected) {
    window.location.href = response.url;
  }
}
function generateTeamData() {
  const teamData = new Team({});
  Object.keys(teamData).forEach((key) => {
    teamData[key] = $(`#team-parameter-${key} input`).val();
  });
  teamData.squad = [];
  $('#players-table .player').each((index, $player) => {
    const player = new Player({});
    Object.keys(player).forEach((key) => {
      player[key] = $($player).find(`[data-parameter="${key}"]`).val();
    });
    player.id = index;
    teamData.squad.push(player);
  });
  return teamData;
}
async function uploadImage(image, teamId) {
  const teamId = $('#team-id').val();
  const formData = new FormData();
  formData.append('image', image);
  const href = $('#team-crest').attr('href');
  const response = await fetch(`${href}/${teamId}`, {
    method: 'PUT',
    body: formData,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert('Error: failed to upload team crest');
  }
}
export default function submitHandler() {
  const teamData = generateTeamData();
  console.log(teamData);
  const callback = () => {
    const imageFile = getImageFile();
    // TODO: add image handling
  }
  sendData(teamData, callback);
}
