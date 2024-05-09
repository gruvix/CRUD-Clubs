export function isUsernameValid(username: string): boolean {
  const regexLettersWithNoDefault = /^[^\W\d_](?!default$)[^\W\d_]*$/i;
  if (regexLettersWithNoDefault.test(username)) {
    return true;
  }
  return false;
}
