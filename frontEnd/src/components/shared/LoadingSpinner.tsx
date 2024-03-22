import React from 'react';

export default function LoadingSpinner({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="spinner-border text-primary" role="status" style={style}>
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
