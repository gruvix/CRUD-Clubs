"use client";
import React from "react";
import { webAppPaths } from "../../paths";
import LoginButton from "./LoginButton";
import APIAdapter from "@/components/adapters/APIAdapter";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import loginErrorHandler from "./loginErrorHandler";

export default function Login() {
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const checkLoginStatus = () => {
    const request = new APIAdapter();
    request
      .getUserStatus()
      .then((isLoggedIn) => {
        isLoggedIn ? router.push(webAppPaths.teams) : setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        loginErrorHandler(error as Error);
      });
  };
  checkLoginStatus();

  return isLoading ? (
    <><title>CRUD Login</title><LoadingSpinner
      style={{
        marginLeft: "44%",
        marginTop: "20%",
        width: "15rem",
        height: "15rem",
      }} /></>
  ) : (

    <div className="container">
      <title>CRUD Login</title>
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
            style={{
              maxWidth: "300px",
              marginTop: "70%",
              position: "relative",
            }}
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
              ERROR_MESSAGE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
