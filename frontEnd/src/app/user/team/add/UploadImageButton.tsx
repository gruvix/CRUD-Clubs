import React from 'react';
import isImageTypeValid from '@/components/shared/validateImage';

export default function UploadImageButton({ teamCrest }: { teamCrest: File | null }): React.ReactElement {
  if (!teamCrest) {
    return (
      <button
        type="button"
        className="btn btn-shadow btn-outline-warning transition duration-300 ease-in-out hover:scale-125"
        id="upload-image-button"
        style={{ fontSize: '150%', marginBottom: '2%', display: teamCrest ? 'none' : 'block' }}
        onClick={() => { document.getElementById('upload-image-input')?.click(); }}
      >
        <div>
          <span style={{ display: 'block' }}>
            Upload Crest
          </span>
          <span style={{ fontSize: '60%', display: 'block' }}>
            jpeg / jpg / png / gif
          </span>
        </div>
      </button>

    );
  }
  if (isImageTypeValid(teamCrest)) {
    return (

      <button
        type="button"
        className="btn btn-shadow btn-success transition duration-300 ease-in-out hover:scale-125"
        id="uploaded-image-button"
        style={{ fontSize: '150%', marginBottom: '2%' }}
        onClick={() => { document.getElementById('upload-image-input')?.click(); }}
      >
        <div style={{ display: 'block' }}>
          <div>
            Selected file:
          </div>
          <span style={{ fontSize: '60%', display: 'block' }}>
            {teamCrest.name}
          </span>
        </div>
      </button>
    );
  }
  return (
    <button
      type="button"
      className="btn btn-shadow btn-danger transition duration-300 ease-in-out hover:scale-125"
      id="invalid-image-button"
      style={{ fontSize: '150%', marginBottom: '2%' }}
      onClick={() => { document.getElementById('upload-image-input')?.click(); }}
    >
      <div style={{ display: 'block' }}>
        <div>
          Selected file:
        </div>
        <span style={{ fontSize: '60%', display: 'block' }}>
          {teamCrest.name}
        </span>
        <span style={{ fontSize: '60%', display: 'block' }}>
          INVALID FILE TYPE
        </span>
      </div>
    </button>
  );
}
