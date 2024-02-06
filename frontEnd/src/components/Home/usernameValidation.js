export default function validateUsername(username) {
  const regexDefault = /^(?!default$).*$/;
  if (!regexDefault.test(username)) {
    return '"Default" is not available';
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    return 'Username may only contain letters';
  }
  return false;
}
