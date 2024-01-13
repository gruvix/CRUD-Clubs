export default async function resetTeam(callback) {
  const teamId = $('#team-id').val();
  await fetch(`/user/reset/${teamId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  callback();
}
