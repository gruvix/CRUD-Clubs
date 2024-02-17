import React from 'react';

export default function TeamCrest({ teamCrest, hasCustomCrest }) {
  if (hasCustomCrest) {
    return (
      <img src={teamCrest} className="list-team-crest-image" alt="team crest" />
    );
  }
  return (
    <img src={teamCrest} className="list-team-crest-image" alt="team crest" />
  );
}
