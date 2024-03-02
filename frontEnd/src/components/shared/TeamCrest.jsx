import React from 'react';
import { BASE_API_URL } from '../../paths';

export default function TeamCrest({ teamCrest, hasCustomCrest, className }) {
  if (hasCustomCrest) {
    return (
      <img src={`${BASE_API_URL}${teamCrest}`} className={className} alt="team crest" id="team-crest" />
    );
  }
  return (
    <img src={teamCrest} className={className} alt="team crest" id="team-crest" />
  );
}
