function getDomain(req) {
  return `http://${req.headers.host}`;
}

module.exports = { getDomain };
