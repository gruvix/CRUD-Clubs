"use client";
import React, { useEffect } from "react";
import { webAppPaths } from "@/paths";
import APIAdapter from "@/components/adapters/APIAdapter";
import { useRouter } from "next/navigation";
import LoginSpiner from "@/components/shared/loginSpinner";
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

  return (
    <>
      <input
        type="text"
        className="form-control"
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
