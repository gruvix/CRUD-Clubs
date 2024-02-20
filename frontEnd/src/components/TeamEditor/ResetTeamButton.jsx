import React from 'react';

export default function ResetTeamButton({ teamId, hasDefault }) {
  if (hasDefault) {
    const buttonStyle = {
      marginTop: '25px',
    };
    return (
      <button
        type="button"
        id="reset-team-button"
        className="btn btn-shadow btn-outline-danger"
        style={buttonStyle}
        data-bs-toggle="modal"
        data-bs-target="#confirmationModal"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Reset the team to its default values"
      >
        Reset to default
      </button>
    );
  }

  const disabledButtonStyle = {
    marginTop: '25px',
    pointerEvents: 'auto',
  };
  return (
    <button
      type="button"
      id="reset-team-button"
      className="btn btn-shadow btn-outline-danger disabled"
      style={disabledButtonStyle}
      data-toggle="tooltip"
      data-placement="bottom"
      title="This team is custom-made and has no default values"
    >
      Reset to default
    </button>
  );
}
