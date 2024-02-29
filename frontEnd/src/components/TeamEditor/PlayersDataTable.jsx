import React, { useEffect } from 'react';
import APIAdapter from '../adapters/APIAdapter';
import { playerKeys } from '../adapters/Player';

export default function PlayersDataTable({ playersData, teamId, updateTeamCallback }) {
  const [rowsPlayersData, setRowsPlayersData] = React.useState([]);
  const [playerInputValue, setplayerInputValue] = React.useState(
    playerKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {}),
  );
  const [editingRowKey, setEditingRowKey] = React.useState(null);
  const requestAdapter = new APIAdapter();

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
  const enableRowEditing = (playerId, player) => () => {
    setEditingRowKey(playerId);
    const newPlayerInputValues = {};
    Object.keys(playerInputValue).forEach((parameter) => {
      newPlayerInputValues[parameter] = {
        ...playerInputValue[parameter], [playerId]: rowsPlayersData[player][parameter],
      };
    });
    setplayerInputValue(newPlayerInputValues);
  };
  const disableRowEditing = () => {
    setEditingRowKey(null);
  };
  const handleRowUpdate = (playerId) => () => {
    const updatedData = {
      id: playerId,
      name: playerInputValue.name[playerId],
      position: playerInputValue.position[playerId],
      nationality: playerInputValue.nationality[playerId],
    };
    try {
      requestAdapter.updatePlayer(teamId, updatedData);
      disableRowEditing();
      updateTeamCallback();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setRowsPlayersData(playersData);
  }, [playersData]);

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
            Object.keys(rowsPlayersData).map((player) => (
              <tr className="table-dark table-bordered" data-id={rowsPlayersData[player].id} key={rowsPlayersData[player].id}>
                {
                  Object.keys(playerInputValue).map((parameter) => (
                    <td key={`${parameter}-${rowsPlayersData[player].id}`}>
                      <span style={{ display: editingRowKey === rowsPlayersData[player].id ? 'none' : 'inline' }}>{rowsPlayersData[player][parameter]}</span>
                      <input type="text" className="form-control" value={playerInputValue[parameter][rowsPlayersData[player].id]} onChange={(e) => updateInputValue(e, rowsPlayersData[player].id, parameter)} style={{ display: editingRowKey === rowsPlayersData[player].id ? 'inline' : 'none' }} />
                    </td>
                  ))
                }
                <td className="buttons-column" style={buttonsColumnStyle}>
                  <button type="button" className="btn btn-outline-warning edit" onClick={enableRowEditing(rowsPlayersData[player].id, player)} style={{ marginRight: '10px', display: editingRowKey === null ? 'inline' : 'none' }}>
                    edit
                  </button>
                  <button type="button" className="btn btn-outline-danger remove" data-bs-toggle="modal" data-bs-target="#confirmationModal" style={{ display: editingRowKey === null ? 'inline' : 'none' }}>
                    remove
                  </button>
                  <button type="button" className="btn btn-outline-success apply" onClick={() => handleRowUpdate(rowsPlayersData[player].id)()} style={{ display: editingRowKey === rowsPlayersData[player].id ? 'inline' : 'none', marginRight: '10px' }}>
                    apply
                  </button>
                  <button type="button" className="btn btn-outline-secondary cancel" onClick={() => disableRowEditing()} style={{ display: editingRowKey === rowsPlayersData[player].id ? 'inline' : 'none' }}>
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
