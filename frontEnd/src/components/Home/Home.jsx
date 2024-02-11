import React from 'react';
import LoginComponent from './loginHandler.jsx';
import { apiRequestPaths } from '../../paths.js';

export default function Home() {
  const titleStyle = {
    color: 'rgb(255, 187, 0)',
    padding: '10px',
    marginTop: '50px',
  };
  const userInputStyle = {
    maxWidth: '300px',
    marginTop: '70%',
  };
  const userInputErrorStyle = {
    paddingTop: '1%',
  };
  const noOpacityStyle = {
    opacity: '0',
  };
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <h1 className="text-center border border-warning rounded" style={titleStyle}>Timothys Football Club CRUD</h1>
        </div>
      </div>
      <div className="row justify-content-center align-items-center align-self-center">
        <div className="col-md-3 my-auto">
          <div className="input-group" style={userInputStyle}>
            <LoginComponent />
          </div>
        </div>
      </div>
      <div className="row justify-content-center align-items-center" style={userInputErrorStyle}>
        <div className="col-md-3">
          <div className="input-group">
            <p className="alert alert-danger" role="alert" id="username-error" style={noOpacityStyle}>Username may only contain letters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
