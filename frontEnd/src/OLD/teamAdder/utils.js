export default function isImageTypeValid(image) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  return validTypes.includes(image.type);
}
