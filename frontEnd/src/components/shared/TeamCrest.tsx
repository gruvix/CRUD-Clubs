import React from 'react';
interface TeamCrestProps {
  teamCrest: string;
  className: string;
}

export default function TeamCrest({ teamCrest, className }: TeamCrestProps) {
  return (
    <img src={teamCrest} className={className} alt="team crest" id="team-crest" />
  );
}
