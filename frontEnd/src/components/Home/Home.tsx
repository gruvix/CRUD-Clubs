import React, { useEffect } from "react";
import { webAppPaths } from "../../paths";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(webAppPaths.user);
  }, []);
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
    </div>
  );
}
