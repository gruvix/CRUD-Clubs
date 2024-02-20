import React from 'react';

export default function TeamCrest({ teamCrest, hasCustomCrest, className }) {
  if (hasCustomCrest) {
    /* src requires local API domain here */
    return (
      <img src={teamCrest} className={className} alt="team crest" id="team-crest" />
    );
  }
  return (
    <img src={teamCrest} className={className} alt="team crest" id="team-crest" />
  );
}
