import React, { useEffect, useRef } from "react";
import APIAdapter from "@/components/adapters/APIAdapter";
import { TeamParameters } from "@/components/adapters/Team";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface TeamDataTableProps {
  teamData: TeamParameters;
  teamId: number;
  router: AppRouterInstance;
}
interface TeamDataRows {
  [key: string]: string | number;
}
export default function TeamDataTable({
  teamData,
  teamId,
  router,
}: TeamDataTableProps): React.ReactElement {
  const [rowsTeamData, setRowsTeamData] = React.useState<TeamDataRows>({});
  const [editingRowKey, setEditingRowKey] = React.useState<string>("");
  const [inputValue, setInputValue] = React.useState<TeamDataRows>({});
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
  const handleRowUpdate = (key: string) => {
    const updatedData = { [key]: [inputValue[key]] };
    try {
      requestAdapter.updateTeam(teamId, updatedData).then((data) => {
        disableRowEditing();
        updateTeamRow(key);
      });
    } catch (error) {
      console.log(error);
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
              <td>
                <span
                  style={{ display: editingRowKey === key ? "none" : "inline" }}
                >
                  {rowsTeamData[key]}
                </span>
                <input
                  ref={editingRowKey === key ? inputReferece : null}
                  onFocus={handleInputFocus}
                  type="text"
                  className="form-control"
                  value={inputValue[key] ? inputValue[key] : ""}
                  style={{ display: editingRowKey === key ? "inline" : "none" }}
                  id={`input-field-${key}`}
                  onChange={(e) =>
                    setInputValue({ ...inputValue, [key]: e.target.value })
                  }
                  onKeyDown={(e) =>
                    e.key === "Enter" ? handleRowUpdate(key) : null
                  }
                />
              </td>
              <td>
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
                    display: editingRowKey === key ? "inline" : "none",
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
                  style={{ display: editingRowKey === key ? "inline" : "none" }}
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
