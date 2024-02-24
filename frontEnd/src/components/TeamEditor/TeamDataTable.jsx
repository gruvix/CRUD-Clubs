import React, { useEffect } from 'react';

export default function TeamDataTable({ teamData }) {
  const [rowsTeamData, setRowsTeamData] = React.useState([]);
  const [editingRowKey, setEditingRowKey] = React.useState(null);
  const [inputValue, setInputValue] = React.useState({});

  const enableRowEditing = (key) => () => {
    setEditingRowKey(key);
    setInputValue({ ...inputValue, [key]: rowsTeamData[key] });
    document.getElementById(`input-field-${key}`).focus();
  };
  const disableRowEditing = () => () => {
    setEditingRowKey(null);
  };

  useEffect(() => {
    setRowsTeamData(teamData);
  }, [teamData]);

  const parameterKeyStyle = {
    textTransform: 'capitalize',
    paddingTop: '3.5%',
  };

  return (
    <div>
      <table className="table" id="team-table">
        <thead>
          {
            Object.keys(rowsTeamData).map((key) => (
              <tr className="table-dark table-bordered" id={key} key={key}>
                <td className="text-warning" style={parameterKeyStyle}>{key}</td>
                <td>
                  <span style={{ display: editingRowKey === key ? 'none' : 'inline' }}>{rowsTeamData[key]}</span>
                  <input type="text" className="form-control" value={inputValue[key]} style={{ display: editingRowKey === key ? 'inline' : 'none' }} id={`input-field-${key}`} onChange={(e) => setInputValue({ ...inputValue, [key]: e.target.value })} />
                </td>
                <td>
                  <button type="button" className="btn btn-shadow btn-outline-warning edit" onClick={enableRowEditing(key)} style={{ display: editingRowKey === null ? 'inline' : 'none' }}>
                    edit
                  </button>
                  <button type="button" className="btn btn-shadow btn-outline-success apply" onClick={disableRowEditing(key)} style={{ display: editingRowKey === key ? 'inline' : 'none' }} id={`apply-button-${key}`}>
                    apply
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
