import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequestPaths, webAppPaths } from '../../paths';

async function logout() {
  const response = await fetch(apiRequestPaths.logout, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok || response.status === 401) {
    return true;
  }
  throw new Error(`Logout Failed - server response ${response.status}`);
}
export default function LogoutButton({ style, text }: { style?: React.CSSProperties; text: string }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      navigate(webAppPaths.home);
    } catch {
      alert('Error: could not logout');
    }
  };
  return (
    <button type="button" style={style} className="btn btn-shadow btn-outline-warning" id="log-out-button" onClick={() => handleLogout()}>
      {text}
    </button>
  );
}
