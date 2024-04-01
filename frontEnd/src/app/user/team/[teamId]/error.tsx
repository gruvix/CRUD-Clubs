"use client";
import TeamNotFoundError from "@/components/errors/TeamNotFoundError";
import UnauthorizedError from "@/components/errors/UnauthorizedError";
import { webAppPaths } from "@/paths";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [escapeButtonAction, setEscapeButtonAction] = React.useState(
    () => (): void => {},
  );
  const [errorMessage, setErrorMessage] = React.useState("Unkown Error");
  const router = useRouter();
  useEffect(() => {
    if (error instanceof UnauthorizedError) {
      setErrorMessage("Unauthorized access!");
      setEscapeButtonAction(() => () => {
        router.push(webAppPaths.home);
      });
    } else if (error instanceof TeamNotFoundError) {
      setErrorMessage("Team Not Found!");
      setEscapeButtonAction(() => () => {
        router.push(webAppPaths.teams);
      });
    } else {
      setErrorMessage(`${error}`);
      setEscapeButtonAction(() => () => {
        router.push(webAppPaths.teams);
      });
    }
  }, []);
  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <h1
            className="text-center"
            style={{
              color: "rgb(255, 187, 0)",
              padding: "10px",
              marginTop: "50px",
            }}
          >
            {errorMessage}
          </h1>
        </div>
      </div>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-2 my-auto text-center">
          <div
            className="input-group"
            style={{ marginTop: "250px", maxWidth: "300px" }}
          >
            <button
              type="button"
              id="go-home-button"
              className="btn btn-outline-warning"
              onClick={() => escapeButtonAction()}
            >
              Get me out of here!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
