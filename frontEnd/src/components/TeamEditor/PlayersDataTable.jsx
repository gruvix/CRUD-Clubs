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
export default function PlayersDataTable({ playersData }) {
  const [playersDataRows, setPlayersDataRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const fetchRows = async () => {
      try {
        const rows = await createPlayersDataRows(playersData);
        setPlayersDataRows(rows);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRows();
  }, [playersData]);

  const tableStyle = {
    height: '410px',
    overflow: 'auto',
  };
  const noDisplayStyle = {
    display: 'none',
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
  //   {isLoading ? (
  //     <tr>
  //       <td colSpan="3">Loading players data...</td>
  //     </tr>
  //   ) : (
  //     playersDataRows
  //   )}

  return (
    <div style={tableStyle}>
      <table className="table" id="players-table">
        <thead>
          <tr className="table-dark" id="add-player-row" data-id="-1">
            <td className="text-warning">
              Name
              <input type="text" className="form-control" value="" style={noDisplayStyle} data-parameter="name" />
            </td>
            <td className="text-warning">
              Position
              <input type="text" className="form-control" value="" style={noDisplayStyle} data-parameter="position" />
            </td>
            <td className="text-warning">
              Nationality
              <input type="text" className="form-control" value="" style={noDisplayStyle} data-parameter="nationality" />
            </td>
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
          {playersDataRows}
        </thead>
      </table>
    </div>
  );
}
