export default async function resetTeam(callback) {
  const teamId = $('#team-id').val();
  const resetTeamPath = $('#reset-team-button').attr('href');
  await fetch(`${resetTeamPath}/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
