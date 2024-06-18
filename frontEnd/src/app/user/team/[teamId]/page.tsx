"use client";
import React, { useEffect } from "react";
import TeamCrest from "@/components/shared/TeamCrest";
import ResetTeamButton from "./ResetTeamButton";
import TeamDataTable from "./TeamDataTable";
import PlayersDataTable from "./PlayersDataTable";
import { useRouter } from "next/navigation";
import Team from "@/components/adapters/Team";
import APIAdapter from "@/components/adapters/APIAdapter";
import isImageTypeValid from "@/components/shared/validateImage";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import { webAppPaths } from "@/paths";
import "@/css/globals.css";
import FailedToUpdateCrestError from "@/components/errors/FailedToUpdateCrestError";
import UnsupportedMediaTypeError from "@/components/errors/UnsupportedMediaTypeError";

export default function Page({
  params,
}: {
  params: { teamId: string };
}): React.ReactElement {
  const router = useRouter();
  const { teamId } = params;
  const [isLoading, setIsLoading] = React.useState(true);
  const [isCrestLoading, setIsCrestLoading] = React.useState(true);
  const [teamData, setTeamData] = React.useState({} as Team);
  const [modalCallback, setModalCallback] = React.useState(
    () => (): void => {},
  );
  const [modalText, setModalText] = React.useState("");
  const [asyncError, setAsyncError] = React.useState<Error>();
  const request = new APIAdapter();
  const [pageTitle, setPageTitle] = React.useState("CRUD Team - " + teamId);

  const errorHandler = (error: Error) => {
    if (
      error instanceof FailedToUpdateCrestError ||
      error instanceof UnsupportedMediaTypeError
    ) {
      alert(`${error}`);
    } else {
      setAsyncError(error);
    }
  };
  const updateLocalTeamData = async () => {
    setIsLoading(true);
    setIsCrestLoading(true);
    request
      .getTeam(teamId)
      .then((data) => {
        setTeamData(data);
        setPageTitle(`CRUD Team ${teamId} - ${data.teamParameters.name}`);
        setIsLoading(false);
        setIsCrestLoading(false);
      })
      .catch((error: Error) => {
        errorHandler(error);
      });
  };
  const handleImageUpdate = (image: File) => {
    if (!isImageTypeValid(image)) {
      alert("Error: invalid image type");
    } else {
      setIsCrestLoading(true);
      request
        .updateTeamCrest(teamId, image)
        .then((newCrestUrl: string) => {
          setTeamData((previousState) => ({
            ...previousState,
            other: { ...previousState.other, crestUrl: newCrestUrl },
          }));
        })
        .catch((error: Error) => {
          errorHandler(error);
        })
        .finally(() => {
          setIsCrestLoading(false);
        });
    }
  };
  const resetTeam = () => async () => {
    await request
      .resetTeam(teamId)
      .then(() => {
        updateLocalTeamData();
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  useEffect(() => {
    updateLocalTeamData();
  }, []);
  useEffect(() => {
    if (asyncError) {
      throw asyncError;
    }
  }, [asyncError]);

  return (
    <div className="container">
      <title>{pageTitle}</title>
      <div className="row">
        <div className="col-4">
          <button
            type="button"
            className="btn btn-shadow btn-outline-warning"
            style={{ marginTop: "25px" }}
            onClick={() => router.push(webAppPaths.teams)}
            id="back-to-teams-button"
          >
            Go back
          </button>
        </div>
        {isCrestLoading ? (
          <LoadingSpinner
            style={{
              marginLeft: "10rem",
              marginTop: "10rem",
              width: "7rem",
              height: "7rem",
            }}
          />
        ) : (
          <>
            <div className="col-4">
              <div className="d-flex justify-content-center img-container">
                <TeamCrest
                  teamCrest={teamData.other.crestUrl}
                  className="team-crest-image"
                />
                <button
                  type="button"
                  className="btn btn-shadow overlay-button btn-outline-warning position-absolute top-50 start-50 translate-middle"
                  id="upload-image-button"
                  style={{ fontSize: "150%" }}
                  onClick={() =>
                    document.getElementById("image-input")?.click()
                  }
                >
                  <span style={{ display: "block" }}>Upload new image</span>
                  <span style={{ fontSize: "60%", display: "block" }}>
                    jpeg / jpg / png / gif
                  </span>
                </button>
                <input
                  type="file"
                  id="image-input"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleImageUpdate(e.target.files![0]);
                  }}
                />
              </div>
            </div>
            <div className="col">
              <div className="text-end">
                {teamData.other && (
                  <ResetTeamButton
                    hasDefault={teamData.other.hasDefault}
                    onClickCallback={() => () => {
                      setModalCallback(resetTeam);
                      setModalText(
                        "Are you sure you want to reset this team? All custom data will be lost and this action can not be undone",
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="row" id="tables">
        {isLoading ? (
          <LoadingSpinner
            style={{
              marginLeft: "10rem",
              marginTop: "10rem",
              width: "10rem",
              height: "10rem",
            }}
          />
        ) : (
          <div className="col">
            <strong className="d-flex justify-content-center text-warning table-title">
              Team
            </strong>
            <div className="d-flex justify-content-center">
              <TeamDataTable
                teamData={teamData.teamParameters}
                teamId={Number(teamId)}
                router={router}
              />
            </div>
          </div>
        )}
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
          <div className="col">
            <strong className="d-flex justify-content-center text-warning table-title">
              Players
            </strong>
            <div className="d-flex justify-content-center">
              <PlayersDataTable
                playersData={teamData.players}
                teamId={Number(teamId)}
                setModalCallback={setModalCallback}
                setModalText={setModalText}
                errorHandler={setAsyncError}
                router={router}
              />
            </div>
          </div>
        )}
      </div>
      <ConfirmationModal
        callback={modalCallback}
        confirmationText={modalText}
      />
      <input id="team-id" type="hidden" value={teamId}></input>
    </div>
  );
}
