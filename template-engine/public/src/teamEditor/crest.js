function isImageTypeValid(image) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return validTypes.includes(image.type);
}
function updateImage(imageUrl) {
  $('#team-crest').attr('src', imageUrl);
}
async function uploadImage(image) {
  const teamId = $('#team-id').val();
  const formData = new FormData();
  formData.append('image', image);
  const href = $('#team-crest').attr('href');
  const response = await fetch(`${href}/${teamId}`, {
    method: 'PUT',
    body: formData,
  });
  if (response.redirected) {
    window.location.href = response.url;
  }
  if (!response.ok) {
    alert('Error: could not update team crest');
  } else {
    const imageUrl = await response.text();
    updateImage(imageUrl);
  }
}

export default function handleImageUpdate(image) {
  if (!isImageTypeValid(image)) {
    alert('Error: invalid image type');
    return;
  }
  uploadImage(image);
}
