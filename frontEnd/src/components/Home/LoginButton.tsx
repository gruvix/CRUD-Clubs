import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import validateUsername from "./usernameValidation";
import loginErrorHandler from "./loginErrorHandler";
import { apiRequestPaths, webAppPaths } from "../../paths";
import LoadingSpinner from "../shared/LoadingSpinner";

async function login(username: string) {
  console.log(`Logging in ${username}`);
  const error = validateUsername(username);
  if (error) {
    throw new Error(error);
  }
  const response = await fetch(apiRequestPaths.login, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });

  if (!response.ok) {
    throw new Error(`Login Failed - server response ${response.status}`);
  }
} // THIS REQUEST MUST GO IN API ADAPTER

export default function LoginButton() {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(username);
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
