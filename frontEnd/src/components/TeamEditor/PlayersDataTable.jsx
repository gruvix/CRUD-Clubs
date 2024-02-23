import React, { useEffect } from 'react';

async function createPlayersDataRows(playersData) {
  const noDisplayStyle = {
    display: 'none',
  };
  const buttonsColumnStyle = {
    display: 'flex',
    minHeight: '42px',
  };
  const editButtonStyle = {
    marginRight: '10px',
  };
  const applyButtonStyle = {
    marginRight: '10px',
    display: 'none',
  };
  return playersData.map((player) => (
    <tr className="table-dark table-bordered" data-id={player.id} key={player.id}>
      <td>
        <span>{player.name}</span>
        <input type="text" className="form-control" value="" style={noDisplayStyle} data-parameter="name" />
      </td>
      <td>
        <span>{player.position}</span>
        <input type="text" className="form-control" value="" style={noDisplayStyle} data-parameter="position" />
      </td>
      <td>
        <span>{player.nationality}</span>
        <input type="text" className="form-control" value="" style={noDisplayStyle} data-parameter="nationality" />
      </td>
      <td className="buttons-column" style={buttonsColumnStyle}>
        <button type="button" className="btn btn-outline-warning edit" style={editButtonStyle}>
          edit
        </button>
        <button type="button" className="btn btn-outline-danger remove" data-bs-toggle="modal" data-bs-target="#confirmationModal">
          remove
        </button>
        <button type="button" className="btn btn-outline-success apply" style={applyButtonStyle}>
          apply
        </button>
        <button type="button" className="btn btn-outline-secondary cancel" style={noDisplayStyle}>
          cancel
        </button>
      </td>
    </tr>
  ));
}
