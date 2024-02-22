import React, { useEffect } from 'react';

async function createTeamDataRows(teamData) {
  const parameterKeyStyle = {
    textTransform: 'capitalize',
    paddingTop: '3.5%',
  };
  const noDisplayStyle = {
    display: 'none',
  };
  return Object.keys(teamData).map((key) => (
    <tr className="table-dark table-bordered" key={key}>
      <td className="text-warning" style={parameterKeyStyle}>{key}</td>
      <td id={key}>
        <span>{teamData[key]}</span>
        <input type="text" className="form-control" value="" style={noDisplayStyle} />
      </td>
      <td>
        <button type="button" className="btn btn-shadow btn-outline-warning edit">
          edit
        </button>
        <button type="button" className="btn btn-shadow btn-outline-success apply" style={noDisplayStyle}>
          apply
        </button>
      </td>
    </tr>
  ));
}
export default function TeamDataTable({ teamData }) {
  const [teamDataRows, setTeamDataRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    const fetchRows = async () => {
      try {
        const rows = await createTeamDataRows(teamData);
        setTeamDataRows(rows);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRows();
  }, [teamData]);
  return (
    <div>
      <table className="table" id="team-table">
        <thead>
          {isLoading ? (
            <tr>
              <td colSpan="3">Loading team data...</td>
            </tr>
          ) : (
            teamDataRows
          )}
        </thead>
      </table>
    </div>
  );
}
