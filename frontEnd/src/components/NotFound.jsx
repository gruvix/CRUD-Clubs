import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const errorMessageStyle = {
    color: 'rgb(255, 187, 0)',
    padding: '10px',
    marginTop: '50px',
  };
  const goHomeButtonStyle = {
    marginTop: '250px',
    maxWidth: '300px',
  };
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <h1 className="text-center" style={errorMessageStyle}>Error 404. Page not found</h1>
        </div>
      </div>

      <div className="row justify-content-center align-items-center">
        <div className="col-md-2 my-auto text-center">
          <div className="input-group" style={goHomeButtonStyle}>
            <button type="button" id="go-home-button" className="btn btn-outline-warning" onClick={() => navigate('/')}>
              Get me out of here!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
