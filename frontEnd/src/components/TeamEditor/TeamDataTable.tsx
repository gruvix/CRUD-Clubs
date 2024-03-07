import React, { useEffect } from 'react';
import APIAdapter from '../adapters/APIAdapter';
import { TeamParameters } from '../adapters/Team';

interface TeamDataTableProps {
  teamData: TeamParameters;
  teamId: number;
  handleTeamDataUpdate: () => void;
}
export default function TeamDataTable({ teamData, teamId, handleTeamDataUpdate }: TeamDataTableProps): React.ReactElement {
  const [rowsTeamData, setRowsTeamData] = React.useState<{ [key: string]: string | number }>({});
  const [editingRowKey, setEditingRowKey] = React.useState(null);
  const [inputValue, setInputValue] = React.useState<{ [key: string]: string | number }>({});
  const requestAdapter = new APIAdapter();

  const enableRowEditing = (key: string) => () => {
    setEditingRowKey(key);
    setInputValue({ ...inputValue, [key]: rowsTeamData[key] });
    document.getElementById(`input-field-${key}`).focus();
  };
  const disableRowEditing = () => {
    setEditingRowKey(null);
  };
  const handleRowUpdate = (key: string) => () => {
    const updatedData = { [key]: [inputValue[key]] };
    try {
      requestAdapter.updateTeam(teamId, updatedData);
      disableRowEditing();
      handleTeamDataUpdate();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setRowsTeamData(teamData);
  }, [teamData]);

  return (
    <div>
      <table className="table" id="team-table">
        <thead>
          {
            Object.keys(rowsTeamData).map((key: string) => (
              <tr className="table-dark table-bordered" id={key} key={key}>
                <td className="text-warning" style={{ textTransform: 'capitalize', paddingTop: '3.5%' }}>{key}</td>
                <td>
                  <span style={{ display: editingRowKey === key ? 'none' : 'inline' }}>{rowsTeamData[key]}</span>
                  <input type="text" className="form-control" value={inputValue[key]} style={{ display: editingRowKey === key ? 'inline' : 'none' }} id={`input-field-${key}`} onChange={(e) => setInputValue({ ...inputValue, [key]: e.target.value })} />
                </td>
                <td>
                  <button type="button" className="btn btn-shadow btn-outline-warning edit" onClick={enableRowEditing(key)} style={{ display: editingRowKey === null ? 'inline' : 'none' }}>
                    edit
                  </button>
                  <button type="button" className="btn btn-shadow btn-outline-success apply" onClick={handleRowUpdate(key)} style={{ display: editingRowKey === key ? 'inline' : 'none', marginRight: '10px' }} id={`apply-button-${key}`}>
                    apply
                  </button>
                  <button type="button" className="btn btn-outline-secondary cancel" onClick={() => disableRowEditing()} style={{ display: editingRowKey === key ? 'inline' : 'none' }}>
                    cancel
                  </button>
                </td>
              </tr>
            ))
            }
        </thead>
      </table>
    </div>
  );
}
