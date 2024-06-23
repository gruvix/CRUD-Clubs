import React, { useEffect } from "react";
interface TeamCrestProps {
  teamCrest: string;
  className: string;
}

export default function TeamCrest({ teamCrest, className }: TeamCrestProps) {
  const [spin, setSpin] = React.useState<boolean>(false);
  return (
    <img
      src={teamCrest}
      className={className + ` transition-transform duration-300 ease-in-out rotate-[${spin ? 360 : 0}deg]`}
      alt="team crest"
      id="team-crest"
      onClick={() => setSpin((previousState) => !previousState)}
    />
  );
}
