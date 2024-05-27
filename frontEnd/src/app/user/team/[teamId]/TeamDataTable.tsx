import React, { useEffect, useRef } from "react";
import APIAdapter from "@/components/adapters/APIAdapter";
import { TeamParameters } from "@/components/adapters/Team";
import LoginSpiner from "@/components/shared/loginSpinner";

interface TeamDataTableProps {
  teamData: TeamParameters;
  teamId: number;
}
interface TeamDataRows {
  [key: string]: string | number;
}
export default function TeamDataTable({
  teamData,
  teamId,
}: TeamDataTableProps): React.ReactElement {
  const [rowsTeamData, setRowsTeamData] = React.useState<TeamDataRows>({});
  const [editingRowKey, setEditingRowKey] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<TeamDataRows>({});
  const [rowLoading, setRowLoading] = React.useState<string>("");
  const inputReferece = useRef(null);
  const requestAdapter = new APIAdapter();

  const enableRowEditing = (key: string) => {
    setEditingRowKey(key);
    setInputValue({ ...inputValue, [key]: rowsTeamData[key] });
  };
  const disableRowEditing = () => {
    setEditingRowKey("");
  };
  const updateTeamRow = (key: string) => {
    const newState = { ...rowsTeamData, [key]: inputValue[key] };
    setRowsTeamData(newState);
  };
  const handleRowUpdate = async (key: string) => {
    setRowLoading(key);

    const updatedData = { [key]: [inputValue[key]] };
    try {
      await requestAdapter.updateTeam(teamId, updatedData).then(() => {
        disableRowEditing();
        updateTeamRow(key);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setRowLoading("");
    }
  };
  const handleInputFocus = (event: React.ChangeEvent<HTMLInputElement>) =>
    event.target.select();
  useEffect(() => {
    inputReferece.current?.focus();
  }, [editingRowKey]);

  useEffect(() => {
    setRowsTeamData(teamData);
    setInputValue({ ...rowsTeamData });
  }, [teamData]);

  return (
    <div>
      <table className="table" id="team-table">
        <thead>
          {Object.keys(rowsTeamData).map((key: string) => (
            <tr className="table-dark table-bordered" id={key} key={key}>
              <td
                className="text-warning"
                style={{ textTransform: "capitalize", paddingTop: "3.5%" }}
              >
                {key}
              </td>
              <td style={{ position: "relative" }}>
                <LoginSpiner
                  style={{
                    display: rowLoading === key ? "inline" : "none",
                    left: "42%",
                    bottom: "15%",
                    width: "2rem",
                    height: "2rem",
                    zIndex: "100",
                  }}
                />
                <>
                  <span
                    style={{
                      display: editingRowKey === key ? "none" : "inline",
                    }}
                  >
                    {rowsTeamData[key]}
                  </span>
                  <input
                    ref={editingRowKey === key ? inputReferece : null}
                    onFocus={handleInputFocus}
                    type="text"
                    disabled={rowLoading === key ? true : false}
                    className="form-control"
                    value={inputValue[key] ? inputValue[key] : ""}
                    style={{
                      display: editingRowKey === key ? "inline" : "none",
                    }}
                    id={`input-field-${key}`}
                    onChange={(e) =>
                      setInputValue({ ...inputValue, [key]: e.target.value })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" ? handleRowUpdate(key) : null
                    }
                  />
                </>
              </td>
              <td>
                <button
                  className="btn btn-outline-success disabled"
                  disabled
                  style={{ display: rowLoading === key ? "inline" : "none" }}
                >
                  Updating...
                </button>
                <button
                  type="button"
                  className="btn btn-shadow btn-outline-warning edit"
                  onClick={() => enableRowEditing(key)}
                  style={{
                    display: editingRowKey === "" ? "inline" : "none",
                  }}
                >
                  edit
                </button>
                <button
                  type="button"
                  className="btn btn-shadow btn-outline-success apply"
                  onClick={() => handleRowUpdate(key)}
                  style={{
                    display:
                      editingRowKey === key && rowLoading !== key
                        ? "inline"
                        : "none",
                    marginRight: "10px",
                  }}
                  id={`apply-button-${key}`}
                >
                  apply
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary cancel"
                  onClick={() => disableRowEditing()}
                  style={{
                    display:
                      editingRowKey === key && rowLoading !== key
                        ? "inline"
                        : "none",
                  }}
                >
                  cancel
                </button>
              </td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  );
}
