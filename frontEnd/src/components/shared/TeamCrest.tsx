import React from "react";

interface TeamCrestProps {
  teamCrest: string;
  className: string;
}

export default function TeamCrest({ teamCrest, className }: TeamCrestProps) {
  const [spin, setSpin] = React.useState<boolean>(false);
  return (
    <img
      src={teamCrest}
      className={
        className + ` transition-all duration-300 ease-in-out ${spin ? 'rotate-0' : 'rotate-[360deg]'}`
      }
      alt="team crest"
      id="team-crest"
      onClick={() => setSpin((previousState) => !previousState)}
    />
  );
}
