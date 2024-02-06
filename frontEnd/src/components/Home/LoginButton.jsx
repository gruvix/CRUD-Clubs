import React from 'react';

function handleLogin() {
    alert('Login button clicked!');
}
export default function LoginButton() {
  return (

    <button type="button" id="enter-page-button" className="btn btn-outline-warning" href="MUST_BE_SET" onClick={handleLogin}>
      Enter Page
    </button>
  );
}
