function getImageFile() {
  return $('#image-input').prop('files')[0];
}
export default function submitHandler() {
  const image = getImageFile();
}
