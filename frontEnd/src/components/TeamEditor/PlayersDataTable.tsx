import React, { useEffect } from 'react';
import APIAdapter, { RedirectData } from '../adapters/APIAdapter';
import Player, { playerKeys } from '../adapters/Player';
import { useNavigate } from 'react-router-dom';

interface PlayersDataTableProps {
  playersData: Player[];
  teamId: number;
}

export default function PlayersDataTable({ playersData, teamId }: PlayersDataTableProps): React.ReactElement {
  const [playerRows, setPlayerRows] = React.useState([] as Player[]);
  const [playerInputRows, setPlayerInputRows] = React.useState([] as Player[]);
  const [editingRowKey, setEditingRowKey] = React.useState(null);
  const navigate = useNavigate();
  const requestAdapter = new APIAdapter();
  function updateInputValue(event: React.ChangeEvent<HTMLInputElement>, index: number, parameter: string) {
    setPlayerInputRows((previousState) => ({
      ...previousState,
      [index]: {
        ...previousState[index],
        [parameter]: event.target.value,
      },
    }));
  }
  const enableRowEditing = (index: number) => {
    setEditingRowKey(index);
    setPlayerInputRows((previousState) => ({
      ...previousState,
      [index]: playerRows[index],
    }));
  };
  const disableRowEditing = () => {
    setEditingRowKey(null);
  };
  const updatePlayerRow = (index: number) => {
    const newState = [...playerRows];
    newState[index] = playerInputRows[index];
    setPlayerRows(newState);
  };
  const handleRowUpdate = (index: number) => {
    const updatedPlayerData = new Player({
      ...playerInputRows[index], id: playerRows[index].id,
    });
    try {
      requestAdapter.updatePlayer(teamId, updatedPlayerData).then((data: RedirectData) => {
        if('redirect' in data) {
          navigate(data.redirect);
      } else {
        disableRowEditing();
        updatePlayerRow(index);
      }
      });
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    setPlayerRows(playersData);
    setPlayerInputRows(playersData);
  }, [playersData]);
  return (
    <div style={{ height: '410px', overflow: 'auto' }}>
      <table className="table" id="players-table">
        <thead>
          <tr className="table-dark" id="add-player-row" data-id="-1">
            {
              playerKeys.map((parameter) => (
                <td className="text-warning" key={parameter}>
                  {parameter}
                  <input type="text" className="form-control" value="" style={{ display: editingRowKey === -1 ? 'inline' : 'none' }} data-parameter={parameter} />
                </td>
              ))
            }
            <td style={{ display: 'flex', minHeight: '80px', paddingTop: '20px' }}>
              <button type="button" className="btn btn-shadow btn-outline-warning" id="add-player-button" style={{ maxHeight: '40px', minWidth: '120px' }}>
                new player
              </button>
              <button type="button" className="btn btn-shadow btn-outline-success" id="confirm-player-button" style={{ maxHeight: '40px', minWidth: '50px', marginRight: '10px', display: 'none' }}>
                Add
              </button>
              <button type="button" className="btn btn-shadow btn-outline-secondary" id="cancel-player-button" style={{ maxHeight: '40px', minWidth: '75px', display: 'none' }}>
                Cancel
              </button>
            </td>
          </tr>
          {
            <>
            {
            playerRows.map((player, index) => (
              <tr className="table-dark table-bordered" key={player.id}>
                {
                  playerKeys.map((parameter) => (
                    <td key={`${parameter}-${player.id}`}>
                      <span style={{ display: editingRowKey === index ? 'none' : 'inline' }}>{player[parameter]}</span>
                      <input
                        type="text"
                        className="form-control"
                        value={playerInputRows[index][parameter]} onChange={(e) => updateInputValue(e, index, parameter)}
                        style={{ display: editingRowKey === index ? 'inline' : 'none' }}
                      />
                    </td>
                  ))
                }
                <td className="buttons-column" style={{ display: 'flex', minHeight: '42px' }}>
                  <button type="button" className="btn btn-outline-warning edit" onClick={() => enableRowEditing(index)} style={{ marginRight: '10px', display: editingRowKey === null ? 'inline' : 'none' }}>
                    edit
                  </button>
                  <button type="button" className="btn btn-outline-danger remove" data-bs-toggle="modal" data-bs-target="#confirmationModal" style={{ display: editingRowKey === null ? 'inline' : 'none' }}>
                    remove
                  </button>
                  <button type="button" className="btn btn-outline-success apply" onClick={() => handleRowUpdate(index)} style={{ display: editingRowKey === index ? 'inline' : 'none', marginRight: '10px' }}>
                    apply
                  </button>
                  <button type="button" className="btn btn-outline-secondary cancel" onClick={() => disableRowEditing()} style={{ display: editingRowKey === index ? 'inline' : 'none' }}>
                    cancel
                  </button>
                </td>
              </tr>
              ))
              }
             </>
          }
        </thead>
      </table>
    </div>
  );
}
