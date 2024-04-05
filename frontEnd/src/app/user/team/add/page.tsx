"use client";
import React, { useEffect } from "react";
import { TeamParameters, teamParametersKeys } from "@/components/adapters/Team";
import { webAppPaths } from "@/paths";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import Player, { playerKeys } from "@/components/adapters/Player";
import UploadImageButton from "./UploadImageButton";
import isImageTypeValid from "@/components/shared/validateImage";
import APIAdapter from "@/components/adapters/APIAdapter";
import { useRouter } from "next/navigation";
import "@/css/globals.css";
import UnsupportedMediaTypeError from "@/components/errors/UnsupportedMediaTypeError";

export default function Page() {
  const [playerSlots, setPlayerSlots] = React.useState([]);
  const [modalCallback, setModalCallback] = React.useState(
    () => (): void => {},
  );
  const [modalText, setModalText] = React.useState("");
  const [teamParameterInputs, setTeamParameterInputs] = React.useState(
    {} as TeamParameters,
  );
  const [asyncError, setAsyncError] = React.useState<Error>();
  const [playerInputs, setPlayerInputs] = React.useState<Player[]>([]);
  const [teamCrest, setTeamCrest] = React.useState<File | null>(null);
  const [canSubmitTeam, setCanSubmitTeam] = React.useState(false);
  const router = useRouter();

  const errorHandler = (error: Error) => {
    if (
      error instanceof UnsupportedMediaTypeError
    ) {
      alert(`${error}`);
    } else {
      setAsyncError(error);
    }
  };
  const returnToTeams = () => {
    router.push(webAppPaths.teams);
  };
  function findNextAvailableSlot(slots: number[]) {
    let nextSlot = 1;
    while (slots.includes(nextSlot)) {
      nextSlot += 1;
    }
    return nextSlot;
  }
  const checkTeamSubmitability = () => {
    if (teamParameterInputs.name && isImageTypeValid(teamCrest)) {
      setCanSubmitTeam(true);
    } else {
      setCanSubmitTeam(false);
    }
  };
  useEffect(() => {
    checkTeamSubmitability();
  }, [teamParameterInputs.name, teamCrest]);
  const submitTeam = () => {
    if (!canSubmitTeam) {
      alert("Error: please fill in a team name and upload a team image.");
      return;
    }
    const adapter = new APIAdapter();
    adapter
      .addTeam(teamParameterInputs, playerInputs, teamCrest!)
      .then((newTeamId) => {
        router.push(webAppPaths.team(newTeamId));
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  useEffect(() => {
    if (asyncError) {
      throw asyncError;
    }
  }, [asyncError]);
  return (
    <div className="container">
      <div className="row">
        <div className="col-4">
          <button
            type="button"
            className="btn btn-shadow btn-outline-warning"
            style={{ marginTop: "25px" }}
            data-bs-toggle="modal"
            data-bs-target="#confirmationModal"
            onClick={() => {
              setModalCallback(() => returnToTeams);
              setModalText(
                "Are you sure you want to go back? All data will be lost.",
              );
            }}
          >
            Go back
          </button>
        </div>
      </div>

      <div className="row" id="tables">
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Team
          </strong>
          <div className="d-flex justify-content-center">
            <table className="table" id="team-table">
              <thead>
                {teamParametersKeys.map((key) => (
                  <tr className="table-dark table-bordered" key={key}>
                    <td
                      className="text-warning"
                      style={{
                        textTransform: "capitalize",
                        paddingTop: "3.5%",
                      }}
                    >
                      {key}
                    </td>
                    <td aria-label={key}>
                      <input
                        onChange={(e) => {
                          setTeamParameterInputs({
                            ...teamParameterInputs,
                            [key]: e.target.value,
                          });
                        }}
                        type="text"
                        className="form-control"
                        value={
                          teamParameterInputs[key]
                            ? teamParameterInputs[key]
                            : ""
                        }
                      />
                    </td>
                  </tr>
                ))}
              </thead>
            </table>
          </div>
        </div>
        <div className="col">
          <strong className="d-flex justify-content-center text-warning table-title">
            Players
          </strong>
          <div className="d-flex justify-content-center">
            <div style={{ height: "410px", overflow: "auto" }}>
              <table className="table" id="players-table">
                <thead>
                  <tr className="table-dark" id="add-player-row">
                    <td className="text-warning">Name</td>
                    <td className="text-warning">Position</td>
                    <td className="text-warning">Nationality</td>
                    <td
                      style={{
                        display: "flex",
                        minHeight: "80px",
                        paddingTop: "20px",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-shadow btn-outline-warning"
                        id="add-player-button"
                        style={{ maxHeight: "40px", minWidth: "120px" }}
                        onClick={() => {
                          const nextAvailableSlot =
                            findNextAvailableSlot(playerSlots);
                          setPlayerSlots([...playerSlots, nextAvailableSlot]);
                        }}
                      >
                        Add player
                      </button>
                    </td>
                  </tr>
                  {playerSlots.map((slot) => (
                    <tr className="table-dark table-bordered player" key={slot}>
                      {playerKeys.map((key) => (
                        <td key={key}>
                          <input
                            type="text"
                            className="form-control"
                            value={playerInputs[slot]?.[key] || ""}
                            data-parameter={key}
                            onChange={(e) =>
                              setPlayerInputs({
                                ...playerInputs,
                                [slot]: {
                                  ...playerInputs[slot],
                                  [key]: e.target.value,
                                },
                              })
                            }
                          />
                        </td>
                      ))}
                      <td
                        className="buttons-column"
                        style={{ display: "flex", minHeight: "42px" }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline-danger remove"
                          onClick={() =>
                            setPlayerSlots(
                              playerSlots.filter((s) => s !== slot),
                            )
                          }
                        >
                          remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="d-flex justify-content-center img-container">
          <UploadImageButton teamCrest={teamCrest} />
          <input
            type="file"
            id="upload-image-input"
            style={{ display: "none" }}
            onChange={(e) => {
              setTeamCrest(e.target.files[0]);
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="d-flex justify-content-center img-container">
          <button
            type="button"
            className="btn btn-shadow btn-outline-warning"
            disabled={!canSubmitTeam}
            id="submit-team-button"
            style={{ fontSize: "150%" }}
            onClick={() => submitTeam()}
          >
            <span style={{ display: "block" }}>Submit Team</span>
          </button>
        </div>
      </div>
      <ConfirmationModal
        callback={modalCallback}
        confirmationText={modalText}
      />
    </div>
  );
}
