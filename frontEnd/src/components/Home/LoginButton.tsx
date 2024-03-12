import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loginErrorHandler from "./loginErrorHandler";
import { webAppPaths } from "../../paths";
import LoadingSpinner from "../shared/LoadingSpinner";
import APIAdapter from "../adapters/APIAdapter";

export default function LoginButton() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const request = new APIAdapter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await request.login(username);
      navigate(webAppPaths.teams);
    } catch (error) {
      loginErrorHandler(error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    setIsLoading(false);
  });

  return (
    <>
      <input
        type="text"
        className="form-control"
        id="username"
        placeholder="Username"
        onKeyDown={(e) => (e.key === "Enter" ? handleLogin() : null)}
        onChange={(e) => setUsername(e.target.value)}
      />
      {isLoading ? (
        <LoadingSpinner
          style={{
            marginLeft: "40rem",
            marginTop: "10rem",
            width: "10rem",
            height: "10rem",
          }}
        />
      ) : (
        <button
          type="button"
          id="enter-page-button"
          className="btn btn-outline-warning"
          onClick={handleLogin}
        >
          Enter Page
        </button>
      )}
    </>
  );
}
