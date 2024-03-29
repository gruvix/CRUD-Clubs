import React, { useEffect } from "react";
import { webAppPaths } from "../../paths";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import APIAdapter from "../adapters/APIAdapter";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const request = new APIAdapter();

  const handleLoginCheck = async () => {
    try {
      const isLoggedIn = await request.getUserStatus();
      if (isLoggedIn) navigate(webAppPaths.teams);
      else setIsLoading(false);
    } catch {
      alert("Error: could not check login status");
    }
  };
  useEffect(() => {
    handleLoginCheck();
  }, []);

  return isLoading ? (
    <div className="d-flex justify-content-center">
      <LoadingSpinner
        style={{ marginTop: "20%", width: "15rem", height: "15rem" }}
      />
    </div>
  ) : (
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
