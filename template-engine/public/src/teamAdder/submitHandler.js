function getImageFile() {
  return $('#image-input').prop('files')[0];
}
async function sendData(teamData) {
  const href = $('#submit-team-button').attr('href');
  const response = await fetch(href, {
    method: 'POST',
    headers: { application: 'json' },
    body: teamData,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert(`Error ${response.status}: could not add team`);
  }
}
export default function submitHandler() {
  const image = getImageFile();
  sendData({});
}
