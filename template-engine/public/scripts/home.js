function showUsernameError(error) {
  $('#username-error').text(error);
  $('#username-error').show();
  $('#username-error').delay(1500).fadeOut();
}

function validateUsername(username) {
  const regexDefault = /^(?!default$).*$/;
  if (!regexDefault.test(username)) {
    return '"Default" is not available';
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    return 'Username may only contain letters';
  }
  return false;
}
async function login(username) {
  const response = await fetch(`/login/${username}`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
}
function handleLogin() {
  const username = $('#username').val().toLowerCase();
  const error = validateUsername(username);
  if (!error) {
    login(username);
  } else {
    showUsernameError(error);
  }
}

$('#enter-page-button').on('click', () => {
  handleLogin();
});
$('#username').on('keydown', (event) => {
  if (event.key === 'Enter') {
    handleLogin();
  }
});

$('#username').trigger('focus');
