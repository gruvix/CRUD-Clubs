import React from 'react';
import { useParams } from 'react-router-dom';

export default function TeamEditor() {
  const { teamId } = useParams();
  return (
    <div>
      <h1>Team {teamId}</h1>
    </div>
  );
}
