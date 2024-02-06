import React from 'react';

export default function Home() {
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <h1 className="text-center border border-warning rounded" style="color: rgb(255, 187, 0); padding: 10px; margin-top: 50px">Timothy's Football Club CRUD</h1>
        </div>
      </div>
      <div className="row justify-content-center align-items-center align-self-center">
        <div className="col-md-3 my-auto">
          <div className="input-group" style="max-width: 300px; margin-top: 250px;">
            <input type="text" className="form-control" id="username" placeholder="Username" />
            <button type="button" id="enter-page-button" className="btn btn-outline-warning" href="MUST_BE_SET">
              Enter Page
            </button>
          </div>
        </div>
      </div>
      <div className="row justify-content-center align-items-center" style="padding-top: 1%;">
        <div className="col-md-3">
          <div className="input-group">
            <p className="alert alert-danger" role="alert" id="username-error" style="display: none;">Username may only contain letters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
