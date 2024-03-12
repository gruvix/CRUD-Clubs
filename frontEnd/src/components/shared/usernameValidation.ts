export default function validateUsername(username: string) {
  const regexDefault = /^(?!default$).*$/i;
  if (!regexDefault.test(username)) {
    return '"Default" is not available';
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    return 'Username may only contain letters';
  }
  return null;
}
