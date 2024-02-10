async function login(username) {
  const loginPath = document.getElementById('enter-page-button').getAttribute('href');
  console.log(`Logging in ${username}, path: ${loginPath}`);
  const response = await fetch(loginPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  console.log('Login fetch ended');
  if (response.redirected) {
    console.log('Login successful. Redirecting to', response.url);
    window.location.href = response.url;
  }
}
