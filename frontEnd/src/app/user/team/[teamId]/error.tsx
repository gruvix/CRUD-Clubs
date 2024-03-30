"use client";
import { webAppPaths } from "@/paths";
import { useRouter } from "next/navigation";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
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
            {error.toString()}
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
              onClick={() => router.push(webAppPaths.teams)}
            >
              Get me out of here!
            </button>            
            <button
              type="button"
              id="go-home-button"
              className="btn btn-outline-warning"
              onClick={() => router.refresh()}
            >
              Reload Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
