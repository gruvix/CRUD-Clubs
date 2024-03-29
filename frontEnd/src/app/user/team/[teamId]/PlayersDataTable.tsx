import React, { useEffect, useRef } from "react";
import APIAdapter, { RedirectData } from "@/components/adapters/APIAdapter";
import Player, { playerKeys } from "@/components/adapters/Player";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface PlayersDataTableProps {
  playersData: Player[];
  teamId: number;
  setModalCallback: (callback: () => void) => void;
  setModalText: (text: string) => void;
  router: AppRouterInstance;
}

export default function PlayersDataTable({
  playersData,
  teamId,
  setModalCallback,
  setModalText,
  router,
}: PlayersDataTableProps): React.ReactElement {
  const NEW_PLAYER_ROW_KEY = -1;
  const [playerRows, setPlayerRows] = React.useState([] as Player[]);
  const [playerInputRows, setPlayerInputRows] = React.useState([] as Player[]);
  const [editingRowKey, setEditingRowKey] = React.useState<number>(NaN);
  const [newPlayerRow, setNewPlayerRow] = React.useState({} as Player);
  const inputReferece = useRef(null);
  const requestAdapter = new APIAdapter();
  const updateInputValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    parameter: string,
  ) => {
    setPlayerInputRows((previousState) => ({
      ...previousState,
      [index]: {
        ...previousState[index],
        [parameter]: event.target.value,
      },
    }));
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
    const updatedPlayerData = new Player({
      ...playerInputRows[index],
      id: playerRows[index].id,
    });
    try {
      requestAdapter
        .updatePlayer(teamId, updatedPlayerData)
        .then((data: RedirectData) => {
          if ("redirect" in data) {
            router.push(data.redirect);
          } else {
            disableRowEditing();
            updatePlayerRow(index);
          }
        });
    } catch (error) {
      alert(error);
    }
  };
  const addPlayerRow = (newId: number) => {
    const newPlayerData = new Player({ ...newPlayerRow, id: newId });
    setPlayerRows((previousState) => [newPlayerData, ...previousState]);
    setPlayerInputRows((previousState) => [...previousState, newPlayerData]);
  };
  const handleNewPlayer = () => {
    try {
      requestAdapter.addPlayer(teamId, newPlayerRow).then((data) => {
        if (typeof data === "object" && "redirect" in data) {
          router.push(data.redirect);
        } else {
          disableRowEditing();
          addPlayerRow(data);
        }
      });
    } catch (error) {
      alert(error);
    }
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
    try {
      requestAdapter.removePlayer(teamId, playerRows[index].id).then((data) => {
        if (typeof data === "object" && "redirect" in data) {
          router.push(data.redirect);
        } else if (data) {
          setPlayerRows((previousState) =>
            previousState.filter((_, i) => i !== index),
          );
        }
      });
    } catch (error) {
      alert(error);
    }
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
            {playerKeys.map((parameter) => (
              <td className="text-warning" key={parameter}>
                {parameter}
                <input
                  type="text"
                  className="form-control"
                  value={newPlayerRow[parameter]? newPlayerRow[parameter] : ""}
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
                <tr
                  className="table-dark table-bordered"
                  key={player.id}
                  data-id={player.id}
                >
                  {playerKeys.map((parameter, keysIndex) => (
                    <td key={`${parameter}-${player.id}`}>
                      <span
                        style={{
                          display: editingRowKey === index ? "none" : "inline",
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
                        value={playerInputRows[index][parameter]? playerInputRows[index][parameter] : ""}
                        onChange={(e) => updateInputValue(e, index, parameter)}
                        style={{
                          display: editingRowKey === index ? "inline" : "none",
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" ? handleRowUpdate(index) : null
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
                      className="btn btn-outline-warning edit"
                      onClick={() => enableRowEditing(index)}
                      style={{
                        marginRight: "10px",
                        display: editingRowKey !== index ? "inline" : "none",
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
                        display: editingRowKey !== index ? "inline" : "none",
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
                        display: editingRowKey === index ? "inline" : "none",
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
                        display: editingRowKey === index ? "inline" : "none",
                      }}
                    >
                      cancel
                    </button>
                  </td>
                </tr>
              ))}
            </>
          }
        </thead>
      </table>
    </div>
  );
}
