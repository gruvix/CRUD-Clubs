import React, { useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface ResetTeamButtonProps {
  hasDefault: boolean;
  onClickCallback: () => void;
}
export default function ResetTeamButton({ hasDefault, onClickCallback}: ResetTeamButtonProps): React.ReactElement {
  const [onClickFunction, setOnClickFunction] = React.useState(() => () => {});
  const [tooltipMessage, setTooltipMessage] = React.useState<string>('');
  const [buttonClassName, setButtonClassName] = React.useState<string>('btn btn-shadow btn-outline-danger disabled');
  const resetTooltip = (props: any) => (
    <Tooltip {...props}>
      {tooltipMessage}
    </Tooltip>
  );
  useEffect(() => {
    if (hasDefault) {
      setTooltipMessage('Reset the team to its default values');
      setOnClickFunction(onClickCallback);
      setButtonClassName('btn btn-shadow btn-outline-danger transition duration-300 ease-in-out hover:scale-125');
    } else {
      setTooltipMessage("This team doesn't have default values");
      setOnClickFunction(() => () => {});
      setButtonClassName('btn btn-shadow btn-outline-danger disabled');
    }
  }, [hasDefault]);
  return (
    <OverlayTrigger placement="bottom" overlay={resetTooltip}>
      <button
        type="button"
        id="reset-team-button"
        className={buttonClassName}
        style={{ marginTop: '25px', pointerEvents: 'auto' }}
        data-bs-toggle={hasDefault? "modal" : null}
        data-bs-target="#confirmationModal"
        data-toggle="tooltip"
        data-placement="bottom"
        title="Reset the team to its default values"
        onClick={onClickFunction}
      >
        Reset to default
      </button>
    </OverlayTrigger>
  );
}
