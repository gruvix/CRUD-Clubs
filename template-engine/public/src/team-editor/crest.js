export default function uploadImage(image) {
  const teamId = $('#team-id').val();
  const formData = new FormData();
  formData.append('image', image);

  fetch(`/user/${teamId}/upload`, {
    method: 'POST',
    body: formData,
  });
}
