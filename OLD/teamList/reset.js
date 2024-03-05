export default async function resetTeams(callback) {
  const resetPath = $('#reset-teams-button').attr('href');
  await fetch(resetPath, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
