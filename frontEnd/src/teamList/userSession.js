export default async function logout() {
  const logoutPath = $('#log-out-button').attr('href');
  console.log(logoutPath);
  const response = await fetch(logoutPath, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
}
