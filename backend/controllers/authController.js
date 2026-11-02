const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { httpError } = require('../middleware/error');

const sign = (u) => jwt.sign({ id: u._id, nombre: u.nombre }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
const publico = (u) => ({ id: u._id, nombre: u.nombre, email: u.email });

exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await User.create({ nombre, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user), user: publico(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email).toLowerCase() });
    // mismo mensaje para email o clave erróneos (no revelar cuál falló)
    if (!user || !(await bcrypt.compare(String(req.body.password), user.password))) throw httpError(401, 'Credenciales incorrectas');
    res.json({ token: sign(user), user: publico(user) });
  } catch (e) { next(e); }
};
