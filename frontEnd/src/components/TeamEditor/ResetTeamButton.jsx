import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function ResetTeamButton({ hasDefault, onClickCallback}) {
  if (hasDefault) {
    const resetTooltip = (props) => (
      <Tooltip {...props}>
        Reset the team to its default values
      </Tooltip>
    );
    const buttonStyle = {
      marginTop: '25px',
    };
    return (
      <OverlayTrigger placement="bottom" overlay={resetTooltip}>
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
          onClick={() => onClickCallback()}
        >
          Reset to default
        </button>
      </OverlayTrigger>
    );
  }

  const resetTooltip = (props) => (
    <Tooltip {...props}>
      This team does not have default values
    </Tooltip>
  );
  const disabledButtonStyle = {
    marginTop: '25px',
    pointerEvents: 'auto',
  };
  return (
    <OverlayTrigger placement="bottom" overlay={resetTooltip}>
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
    </OverlayTrigger>

  );
}
