"use client";
import React, { useEffect } from "react";
import { webAppPaths } from "@/paths";
import APIAdapter from "@/components/adapters/APIAdapter";
import { useRouter } from "next/navigation";
import LoginSpiner from "@/components/shared/loginSpinner";
import validateUsername from "@/components/shared/usernameValidation";
export default function LoginButton({
  setLoginError,
  setLoginErrorMessage,
}: {
  setLoginError: any;
  setLoginErrorMessage: any;
}) {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [inputClassName, setInputClassName] = React.useState("");
  const request = new APIAdapter();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await request.login(username);
      router.push(webAppPaths.teams);
    } catch (error: any) {
      setLoginErrorMessage(error.message);
      setLoginError(true);
      setTimeout(() => {
        setLoginError(false);
      }, 1500);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let error = validateUsername(username);
    error = username? error : ""
    const inputClassString = error ? "text-pink-600 focus:text-pink-600 focus:border-pink-500 border-pink-500" : "";
    setInputClassName(inputClassString);
  }, [username]);

  return (
    <>
      <input
        type="text"
        className={"form-control " + inputClassName}
        id="username"
        placeholder="Username"
        onKeyDown={(e) => (e.key === "Enter" ? handleLogin() : null)}
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />
      {isLoading ? (
        <LoginSpiner
          style={{
            left: "50%",
            top: "7%",
            width: "2rem",
            height: "2rem",
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
