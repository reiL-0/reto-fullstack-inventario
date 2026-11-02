const { httpError } = require('./error');

// required(['a','b']) -> 400 si falta algún campo en el body
exports.required = (fields) => (req, res, next) => {
  const missing = fields.filter((f) => req.body[f] === undefined || req.body[f] === '');
  next(missing.length ? httpError(400, `Campos requeridos: ${missing.join(', ')}`) : undefined);
};

exports.validEmailPassword = (req, res, next) => {
  const { email, password } = req.body;
  if (!/^\S+@\S+\.\S+$/.test(email)) return next(httpError(400, 'Email inválido'));
  if (String(password).length < 6) return next(httpError(400, 'La contraseña debe tener al menos 6 caracteres'));
  next();
};
