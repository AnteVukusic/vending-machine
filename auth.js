const jwt = require('jsonwebtoken');
const roles = require('./constants/roles');

const routeAuth = (req, res, next, role) => {
  const token = req.headers.authorization;
  if (!token) res.status(401).json({ error: 'Access denied' });
  try {
    req.user = jwt.verify(token, process.env.VM_APP_JWT_SECRET);
  } catch (ex) {
    res.status(401).json({ error: 'Access denied' });
  }

  if (req.user && role === roles.ANY) {
    return next();
  }

  if (req.user && (req.user.role === roles.ADMIN || req.user.role === role)) {
    return next();
  }
  return res.status(401).json({ error: 'Access denied' });
};

const protectedRouteAuth = {
  [roles.ADMIN]: (req, res, next) => routeAuth(req, res, next, roles.ADMIN),
  [roles.BUYER]: (req, res, next) => routeAuth(req, res, next, roles.BUYER),
  [roles.SELLER]: (req, res, next) => routeAuth(req, res, next, roles.SELLER),
  [roles.ANY]: (req, res, next) => routeAuth(req, res, next, roles.ANY),
};

module.exports = protectedRouteAuth;
