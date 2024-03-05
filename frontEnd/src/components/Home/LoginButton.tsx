import React from 'react';
import { useNavigate } from 'react-router-dom';
import validateUsername from './usernameValidation';
import loginErrorHandler from './loginErrorHandler';
import { apiRequestPaths, webAppPaths } from '../../paths';

async function login(username) {
  const error = validateUsername(username);

  if (!error) {
    const loginPath = document
      .getElementById('enter-page-button')
      .getAttribute('href');
    const response = await fetch(loginPath, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`Login Failed - server response ${response.status}`);
    }
  }
  loginErrorHandler(error);
}

export default function LoginButton() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');

  const handleLogin = async () => {
    try {
      await login(username);
      navigate(webAppPaths.teams);
    } catch (error) {
      loginErrorHandler(error);
    }
  };

  return (
    <>
      <input
        type="text"
        className="form-control"
        id="username"
        placeholder="Username"
        onKeyDown={(e) => (e.key === 'Enter' ? handleLogin() : null)}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="button" id="enter-page-button" className="btn btn-outline-warning" href={apiRequestPaths.login} onClick={handleLogin}>
        Enter Page
      </button>
    </>
  );
}
