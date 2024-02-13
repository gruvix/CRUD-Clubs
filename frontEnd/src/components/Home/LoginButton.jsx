import React from 'react';
import { useNavigate } from 'react-router-dom';
import validateUsername from './usernameValidation';
import loginErrorHandler from './loginErrorHandler';
import { apiRequestPaths, webAppPaths } from '../../paths';

async function login(username, responseOkCallback) {
  const loginPath = document.getElementById('enter-page-button').getAttribute('href');
  console.log(`Logging in ${username}, path: ${loginPath}`);
  const response = await fetch(loginPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  if (response.ok) {
    console.log('Login successful');
    responseOkCallback();
  }
}
function handleLogin(loginCallback) {
  const username = document.getElementById('username').value;
  const error = validateUsername(username);
  if (!error) {
    login(username, loginCallback);
  } else {
    loginErrorHandler(error);
  }
}

export default function LoginButton() {
  const navigate = useNavigate();
  const loginCallback = () => {
    navigate(webAppPaths.teams);
  };
  return (
    <>
      <input type="text" className="form-control" id="username" placeholder="Username" onKeyDown={(e) => (e.key === 'Enter' ? handleLogin(loginCallback) : null)} />
      <button type="button" id="enter-page-button" className="btn btn-outline-warning" href={apiRequestPaths.login} onClick={() => { handleLogin(loginCallback); }}>
        Enter Page
      </button>
    </>
  );
}
