export function validateUsername(username: string) {
  const regexLettersWithNoDefault = /^[^\W\d_](?!default$)[^\W\d_]*$/i;
  if (!regexLettersWithNoDefault.test(username)) {
    return 'Invalid username';
  }
  return '';
}
