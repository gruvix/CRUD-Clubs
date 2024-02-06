export default function loginErrorHandler(error) {
  const $errorBox = document.getElementById('username-error');
  $errorBox.textContent = String(error);
}
