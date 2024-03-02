import React from 'react';

export default function TeamCrest({ teamCrest, className }) {
  return (
    <img src={teamCrest} className={className} alt="team crest" id="team-crest" />
  );
}
