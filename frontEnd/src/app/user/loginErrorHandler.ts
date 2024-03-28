export default function loginErrorHandler(error: Error | string) {
  const $errorBox = document.getElementById('username-error');
  if( !$errorBox ) { return; }
  $errorBox.textContent = String(error);
  $errorBox.classList.remove('username-error-hide');
  $errorBox.classList.add('username-error-show');
  $errorBox.style.opacity = '1';
  setTimeout(() => {
    $errorBox.classList.add('username-error-hide');
    $errorBox.classList.remove('username-error-show');
    $errorBox.style.opacity = '0';
  }, 1500);
}
