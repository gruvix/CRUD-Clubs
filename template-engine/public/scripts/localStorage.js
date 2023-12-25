export function loadUsername() {
  return localStorage.getItem('username');
}

export function saveUsername(username) {
  localStorage.setItem('username', username);
}

export function clearUsername() {
  localStorage.removeItem('username');
}
