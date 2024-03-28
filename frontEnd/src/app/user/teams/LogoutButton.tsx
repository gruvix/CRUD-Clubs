import React from 'react';
import { webAppPaths } from '../../../paths';
import APIAdapter from '../../../components/adapters/APIAdapter';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export default function LogoutButton({ style, text, router }: { style?: React.CSSProperties; text: string, router: AppRouterInstance }) {
  const request = new APIAdapter();
  const handleLogout = async () => {
    try {
      request.logout();
      router.push(webAppPaths.home);
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
