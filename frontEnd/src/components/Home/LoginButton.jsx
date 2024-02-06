import React from 'react';
import validateUsername from './usernameValidation';

function handleLogin() {
  const username = document.getElementById('username').value;
  const error = validateUsername(username);
  if (!error) {
    alert('Login successful!');
  } else {
  }
}
export default function LoginButton() {
  return (

    <button type="button" id="enter-page-button" className="btn btn-outline-warning" href="MUST_BE_SET" onClick={handleLogin}>
      Enter Page
    </button>
  );
}
