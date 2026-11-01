const jwt = require('jsonwebtoken');
const { httpError } = require('./error');

// Exige cabecera "Authorization: Bearer <token>"
module.exports = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!token) return next(httpError(401, 'Token requerido'));
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, nombre, iat, exp }
    next();
  } catch {
    next(httpError(401, 'Token inválido o expirado'));
  }
};
