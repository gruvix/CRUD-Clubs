import React, { useEffect } from 'react';

export default function TeamDataTable({ teamData }) {
  const [rowsTeamData, setRowsTeamData] = React.useState([]);
  const [editingRowKey, setEditingRowKey] = React.useState(null);

  const toggleApplyButton = (key, show) => {
    const applyButton = document.getElementById(`apply-button-${key}`);
    if (applyButton) {
      applyButton.style.display = show ? 'inline' : 'none';
    }
  };
  const enableRowEditing = (key) => () => {
    setEditingRowKey(key);
    toggleApplyButton(key, true);
  };
  const disableRowEditing = (key) => () => {
    setEditingRowKey(null);
    toggleApplyButton(key, false);
  };

  useEffect(() => {
    setRowsTeamData(teamData);
  }, [teamData]);

  const parameterKeyStyle = {
    textTransform: 'capitalize',
    paddingTop: '3.5%',
  };
  const noDisplayStyle = {
    display: 'none',
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
                  <input type="text" className="form-control" value="" style={{ display: editingRowKey === key ? 'inline' : 'none' }} />
                </td>
                <td>
                  <button type="button" className="btn btn-shadow btn-outline-warning edit" onClick={enableRowEditing(key)} style={{ display: editingRowKey === null ? 'inline' : 'none' }}>
                    edit
                  </button>
                  <button type="button" className="btn btn-shadow btn-outline-success apply" onClick={disableRowEditing(key)} style={noDisplayStyle} id={`apply-button-${key}`}>
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
