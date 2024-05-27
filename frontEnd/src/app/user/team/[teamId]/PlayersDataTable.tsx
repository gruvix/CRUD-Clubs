import React, { useEffect, useRef } from "react";
import APIAdapter from "@/components/adapters/APIAdapter";
import Player, { playerKeys } from "@/components/adapters/Player";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import LoginSpiner from "@/components/shared/loginSpinner";

interface PlayersDataTableProps {
  playersData: Player[];
  teamId: number;
  setModalCallback: (callback: () => void) => void;
  setModalText: (text: string) => void;
  router: AppRouterInstance;
  errorHandler: (error: Error) => void;
}

export default function PlayersDataTable({
  playersData,
  teamId,
  setModalCallback,
  setModalText,
  router,
  errorHandler = () => {},
}: PlayersDataTableProps): React.ReactElement {
  const NEW_PLAYER_ROW_KEY = -1;
  const [playerRows, setPlayerRows] = React.useState([] as Player[]);
  const [playerInputRows, setPlayerInputRows] = React.useState([] as Player[]);
  const [editingRowKey, setEditingRowKey] = React.useState<number>(NaN);
  const [newPlayerRow, setNewPlayerRow] = React.useState({} as Player);
  const [rowLoading, setRowLoading] = React.useState<number>(NaN);
  const inputReferece = useRef(null);
  const requestAdapter = new APIAdapter();
  const updateInputValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    parameter: string,
  ) => {
    setPlayerInputRows((previousState) => {
      return previousState.map((player, currentIndex) => {
        if (currentIndex === index) {
          return { ...player, [parameter]: event.target.value };
        } else {
          return player;
        }
      });
    });
  };
  const enableRowEditing = (index: number) => {
    setEditingRowKey(index);
    if (index === NEW_PLAYER_ROW_KEY) {
      setNewPlayerRow({} as Player);
    } else {
      setPlayerInputRows([...playerRows]);
    }
  };
  const disableRowEditing = () => {
    setEditingRowKey(NaN);
  };
  const updatePlayerRow = (index: number) => {
    const newState = [...playerRows];
    newState[index] = playerInputRows[index];
    setPlayerRows(newState);
  };
  const handleRowUpdate = (index: number) => {
    setRowLoading(index);
    const updatedPlayerData = new Player({
      ...playerInputRows[index],
      id: playerRows[index].id,
    });
    requestAdapter
      .updatePlayer(teamId, updatedPlayerData)
      .then(() => {
        disableRowEditing();
        updatePlayerRow(index);
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setRowLoading(NaN);
      });
  };
  const addPlayerRow = (newId: number) => {
    const newPlayerData = new Player({ ...newPlayerRow, id: newId });
    setPlayerRows((previousState) => [newPlayerData, ...previousState]);
    setPlayerInputRows((previousState) => [...previousState, newPlayerData]);
  };
  const handleNewPlayer = () => {
    requestAdapter
      .addPlayer(teamId, newPlayerRow)
      .then((newPlayerId) => {
        disableRowEditing();
        addPlayerRow(newPlayerId);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const updateNewPlayerInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    parameter: string,
  ) => {
    setNewPlayerRow({
      ...newPlayerRow,
      [parameter]: event.target.value,
    });
  };
  const removePlayer = (index: number) => {
    requestAdapter
      .removePlayer(teamId, playerRows[index].id)
      .then(() => {
        setPlayerRows((previousState) =>
          previousState.filter((_, i) => i !== index),
        );
      })
      .catch((error) => {
        errorHandler(error);
      });
  };
  const setModal = (index: number) => {
    setModalCallback(() => () => removePlayer(index));
    setModalText(
      `Are you sure you want to remove player ${playerRows[index].name}?`,
    );
  };
  const handleInputFocus = (event: React.ChangeEvent<HTMLInputElement>) =>
    event.target.select();
  useEffect(() => {
    inputReferece.current?.focus();
  }, [editingRowKey]);
  useEffect(() => {
    setPlayerRows([...playersData]);
    setPlayerInputRows([...playersData]);
  }, [playersData]);
  return (
    <div style={{ height: "410px", overflow: "auto" }}>
      <table className="table" id="players-table">
        <thead>
          <tr className="table-dark" id="add-player-row">
            {playerKeys.map((parameter, keysIndex) => (
              <td className="text-warning" key={parameter}>
                {parameter}
                <input
                  ref={
                    editingRowKey === NEW_PLAYER_ROW_KEY && keysIndex === 0
                      ? inputReferece
                      : null
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleNewPlayer() : null
                  }
                  onFocus={handleInputFocus}
                  type="text"
                  className="form-control"
                  value={newPlayerRow[parameter] ? newPlayerRow[parameter] : ""}
                  style={{
                    display:
                      editingRowKey === NEW_PLAYER_ROW_KEY ? "inline" : "none",
                  }}
                  onChange={(event) => updateNewPlayerInput(event, parameter)}
                />
              </td>
            ))}
            <td
              style={{ display: "flex", minHeight: "80px", paddingTop: "20px" }}
            >
              <button
                type="button"
                className="btn btn-shadow btn-outline-warning"
                id="add-player-button"
                style={{
                  maxHeight: "40px",
                  minWidth: "120px",
                  display:
                    editingRowKey !== NEW_PLAYER_ROW_KEY ? "inline" : "none",
                }}
                onClick={() => enableRowEditing(NEW_PLAYER_ROW_KEY)}
              >
                new player
              </button>
              <button
                type="button"
                className="btn btn-shadow btn-outline-success"
                id="confirm-player-button"
                style={{
                  maxHeight: "40px",
                  minWidth: "50px",
                  marginRight: "10px",
                  display:
                    editingRowKey === NEW_PLAYER_ROW_KEY ? "inline" : "none",
                }}
                onClick={() => handleNewPlayer()}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-shadow btn-outline-secondary"
                id="cancel-player-button"
                style={{
                  maxHeight: "40px",
                  minWidth: "75px",
                  display:
                    editingRowKey === NEW_PLAYER_ROW_KEY ? "inline" : "none",
                }}
                onClick={disableRowEditing}
              >
                Cancel
              </button>
            </td>
          </tr>
          {
            <>
              {playerRows.map((player, index) => (
                <>
                  <tr
                    className="table-dark table-bordered"
                    key={player.id}
                    data-id={player.id}
                  >
                    {rowLoading === index ? (
                      <>
                        {playerKeys.map((parameter, keysIndex) => (
                          <td style={{ position: "relative" }}>
                            <>
                              {keysIndex === 0 ? (
                                <LoginSpiner
                                  style={{
                                    left: "100%",
                                    bottom: "25%",
                                    width: "2rem",
                                    height: "2rem",
                                    zIndex: "100",
                                  }}
                                />
                              ) : (
                                <></>
                              )}
                            </>
                          </td>
                        ))}
                        <td>
                          <button
                            className="btn btn-outline-success disabled"
                            disabled
                          >
                            Updating...
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        {playerKeys.map((parameter, keysIndex) => (
                          <td key={`${parameter}-${player.id}`}>
                            <>
                              <span
                                style={{
                                  display:
                                    editingRowKey === index ? "none" : "inline",
                                }}
                              >
                                {player[parameter]}
                              </span>
                              <input
                                ref={
                                  editingRowKey === index && keysIndex === 0
                                    ? inputReferece
                                    : null
                                }
                                onFocus={handleInputFocus}
                                type="text"
                                className="form-control"
                                value={
                                  playerInputRows[index][parameter]
                                    ? playerInputRows[index][parameter]
                                    : ""
                                }
                                onChange={(e) =>
                                  updateInputValue(e, index, parameter)
                                }
                                style={{
                                  display:
                                    editingRowKey === index ? "inline" : "none",
                                }}
                                onKeyDown={(e) =>
                                  e.key === "Enter"
                                    ? handleRowUpdate(index)
                                    : null
                                }
                              />
                            </>
                          </td>
                        ))}

                        <td
                          className="buttons-column"
                          style={{ display: "flex", minHeight: "42px" }}
                        >
                          <button
                            type="button"
                            className="btn btn-outline-warning edit"
                            onClick={() => enableRowEditing(index)}
                            style={{
                              marginRight: "10px",
                              display:
                                editingRowKey !== index ? "inline" : "none",
                            }}
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger remove"
                            data-bs-toggle="modal"
                            data-bs-target="#confirmationModal"
                            style={{
                              display:
                                editingRowKey !== index ? "inline" : "none",
                            }}
                            onClick={() => setModal(index)}
                          >
                            remove
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-success apply"
                            onClick={() => handleRowUpdate(index)}
                            style={{
                              display:
                                editingRowKey === index ? "inline" : "none",
                              marginRight: "10px",
                            }}
                          >
                            apply
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary cancel"
                            onClick={() => disableRowEditing()}
                            style={{
                              display:
                                editingRowKey === index ? "inline" : "none",
                            }}
                          >
                            cancel
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                </>
              ))}
            </>
          }
        </thead>
      </table>
    </div>
  );
}
