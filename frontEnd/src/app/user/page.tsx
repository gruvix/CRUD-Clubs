import React from "react";
import { webAppPaths } from "../../paths";
import LoginButton from "./LoginButton";
import APIAdapter from "../../components/adapters/APIAdapter";
import { redirect } from "next/navigation";
export default function Login() {

  const checkLoginStatus = async () => {
    try {
      const request = new APIAdapter();
      await request.getUserStatus() ? redirect(webAppPaths.teams) : null;
    } catch (error) {
      alert("Error: could not check login status");
      console.log(error);
    } finally {
    }
  };
  checkLoginStatus();
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <h1
            className="text-center border border-warning rounded"
            style={{
              color: "rgb(255, 187, 0)",
              padding: "10px",
              marginTop: "50px",
            }}
          >
            Timothys Football Club CRUD
          </h1>
        </div>
      </div>
      <div className="row justify-content-center align-items-center align-self-center">
        <div className="col-md-3 my-auto">
          <div
            className="input-group"
            style={{ maxWidth: "300px", marginTop: "70%" }}
          >
            <LoginButton />
          </div>
        </div>
      </div>
      <div
        className="row justify-content-center align-items-center"
        style={{ paddingTop: "1%" }}
      >
        <div className="col-md-3">
          <div className="input-group">
            <p
              className="alert alert-danger"
              role="alert"
              id="username-error"
              style={{ opacity: "0" }}
            >
              Username may only contain letters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
