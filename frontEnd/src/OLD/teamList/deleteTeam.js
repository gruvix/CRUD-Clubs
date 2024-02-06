export default async function deleteTeam(teamPath, teamId) {
  const response = await fetch(`${teamPath}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (response.ok) {
    $(`#${teamId}`).parent().remove();
  } else {
    alert('Error: could not delete team');
  }
}
