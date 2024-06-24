export default function validateUsername(username: string) {
  if (!username) return "Username must not be empty";
  const regexDefault = /^(?!default$).*$/i;
  if (!regexDefault.test(username)) {
    return '"Default" is not available';
  }
  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(username)) {
    return "Username may only contain letters";
  }
  return null;
}
