import { Request } from "express";

function getDomain(req: Request) {
  return `http://${req.headers.host}`;
}
export default getDomain;
