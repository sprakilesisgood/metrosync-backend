const jwt = require('jsonwebtoken');

// needs a valid Bearer token AND role admin, else bounce it
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  if (payload.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.admin = payload; // { id, role }
  next();
}

module.exports = requireAdmin;
