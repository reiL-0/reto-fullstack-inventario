// Lanza un error con código HTTP: throw httpError(404, 'No encontrado')
const httpError = (status, message) => Object.assign(new Error(message), { status });

const notFound = (req, res, next) => next(httpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));

// Manejador central: todo error termina aquí con JSON uniforme { error }
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors).map((e) => e.message).join(', '); }
  else if (err.name === 'CastError') { status = 400; message = 'ID inválido'; }
  else if (err.code === 11000) { status = 409; message = 'El registro ya existe'; }
  else if (err.type === 'entity.parse.failed') { status = 400; message = 'JSON inválido'; }
  if (status === 500) { console.error(err); message = 'Error interno del servidor'; }
  res.status(status).json({ error: message });
};

module.exports = { httpError, notFound, errorHandler };
