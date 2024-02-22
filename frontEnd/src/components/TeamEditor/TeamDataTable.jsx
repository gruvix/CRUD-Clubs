import React, { useEffect } from 'react';

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
