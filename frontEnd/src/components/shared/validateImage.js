export default function isImageTypeValid(image) {
  if (!image) {
    return false;
  }
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return validTypes.includes(image.type);
}
