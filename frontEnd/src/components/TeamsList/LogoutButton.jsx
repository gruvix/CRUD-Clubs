import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequestPaths, webAppPaths } from '../../paths';

async function logout(redirectCallback) {
  const response = await fetch(apiRequestPaths.logout, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok || response.status === 401) {
    redirectCallback();
  }
}
function logoutHandler(logoutCallback) {
  logout(logoutCallback);
}
export default function LogoutButton({ style, text }) {
  const navigate = useNavigate();
  const logoutCallback = () => {
    navigate(webAppPaths.home);
  };
  return (
    <button type="button" style={style} className="btn btn-shadow btn-outline-warning" id="log-out-button" onClick={() => logoutHandler(logoutCallback)}>
      {text}
    </button>
  );
}
