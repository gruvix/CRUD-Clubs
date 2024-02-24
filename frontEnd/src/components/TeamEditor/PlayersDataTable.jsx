import React from 'react';

export default function PlayersDataTable({ playersData }) {
  const [playerInputValue, setplayerInputValue] = React.useState({
    name: {}, position: {}, nationality: {},
  });
  const [editingRowKey, setEditingRowKey] = React.useState(null);

  const tableStyle = {
    height: '410px',
    overflow: 'auto',
  };
  const addPlayerButtonsCellStyle = {
    display: 'flex',
    minHeight: '80px',
    paddingTop: '20px',
  };
  const newPlayerButtonStyle = {
    maxHeight: '40px',
    minWidth: '120px',
  };
  const addPlayerButtonStyle = {
    maxHeight: '40px',
    minWidth: '50px',
    marginRight: '10px',
    display: 'none',
  };
  const cancelButtonStyle = {
    maxHeight: '40px',
    minWidth: '75px',
    display: 'none',
  };
  const buttonsColumnStyle = {
    display: 'flex',
    minHeight: '42px',
  };
  function updateInputValue(event, playerId, parameter) {
    setplayerInputValue({
      ...playerInputValue,
      [parameter]: {
        ...playerInputValue[parameter], [playerId]: event.target.value,
      },
    });
  }
  const enableRowEditing = (playerId) => () => {
    setEditingRowKey(playerId);
  };
  const disableRowEditing = () => () => {
    setEditingRowKey(null);
  }

  return (
    <div style={tableStyle}>
      <table className="table" id="players-table">
        <thead>
          <tr className="table-dark" id="add-player-row" data-id="-1">
            {
              Object.keys(playerInputValue).map((parameter) => (
                <td className="text-warning" key={parameter}>
                  {parameter}
                  <input type="text" className="form-control" value="" style={{ display: editingRowKey === -1 ? 'inline' : 'none' }} data-parameter={parameter} />
                </td>
              ))
            }
            <td style={addPlayerButtonsCellStyle}>
              <button type="button" className="btn btn-shadow btn-outline-warning" id="add-player-button" style={newPlayerButtonStyle}>
                new player
              </button>
              <button type="button" className="btn btn-shadow btn-outline-success" id="confirm-player-button" style={addPlayerButtonStyle}>
                Add
              </button>
              <button type="button" className="btn btn-shadow btn-outline-secondary" id="cancel-player-button" style={cancelButtonStyle}>
                Cancel
              </button>
            </td>
          </tr>
          {
            playersData.map((player) => (
              <tr className="table-dark table-bordered" data-id={player.id} key={player.id}>
                {
                  Object.keys(playerInputValue).map((parameter) => (
                    <td key={`${parameter}-${player.id}`}>
                      <span style={{ display: editingRowKey === player.id ? 'none' : 'inline' }}>{player[parameter]}</span>
                      <input type="text" className="form-control" value={playerInputValue[parameter][player.id]} onChange={(e) => updateInputValue(e, player.id, parameter)} style={{ display: editingRowKey === player.id ? 'inline' : 'none' }} />
                    </td>
                  ))
                }
                <td className="buttons-column" style={buttonsColumnStyle}>
                  <button type="button" className="btn btn-outline-warning edit" onClick={enableRowEditing(player.id)} style={{ marginRight: '10px', display: editingRowKey === null ? 'inline' : 'none' }}>
                    edit
                  </button>
                  <button type="button" className="btn btn-outline-danger remove" data-bs-toggle="modal" data-bs-target="#confirmationModal" style={{ display: editingRowKey === null ? 'inline' : 'none' }}>
                    remove
                  </button>
                  <button type="button" className="btn btn-outline-success apply" style={{ display: editingRowKey === player.id ? 'inline' : 'none', marginRight: '10px' }}>
                    apply
                  </button>
                  <button type="button" className="btn btn-outline-secondary cancel" onClick={disableRowEditing()} style={{ display: editingRowKey === player.id ? 'inline' : 'none' }}>
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
