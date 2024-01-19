function isImageTypeValid(image) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return validTypes.includes(image.type);
}

function uploadImage(image) {
  const teamId = $('#team-id').val();
  const formData = new FormData();
  formData.append('image', image);
  fetch(`/user/${teamId}/upload`, {
    method: 'POST',
    body: formData,
  });
}

export default function handleImageUpdate(image) {
  if (!isImageTypeValid(image)) {
    alert('Error: invalid image type');
    return;
  }
  uploadImage(image);
}
