import Player from '../../models/player.js';
import Team from '../../models/team.js';

function getImageFile() {
  return $('#image-input').prop('files')[0];
}
async function sendData(teamData, imageFile) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('teamData', JSON.stringify(teamData));
  const href = $('#submit-team-button').attr('href');
  const response = await fetch(href, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    alert(`Error ${response.status}: could not add team`);
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
export default function submitHandler() {
  const teamData = generateTeamData();
  const imageFile = getImageFile();
  sendData(teamData, imageFile);
}
