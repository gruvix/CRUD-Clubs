import React from 'react';
import { useNavigate } from 'react-router-dom';
import { webAppPaths } from '../../paths';
import APIAdapter from '../adapters/APIAdapter';

export default function LogoutButton({ style, text }: { style?: React.CSSProperties; text: string }) {
  const navigate = useNavigate();
  const request = new APIAdapter();
  const handleLogout = async () => {
    try {
      request.logout();
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
