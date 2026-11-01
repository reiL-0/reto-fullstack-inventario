const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { httpError } = require('../middleware/error');
const { required, validEmailPassword } = require('../middleware/validate');

const sign = (u) => jwt.sign({ id: u._id, nombre: u.nombre }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '2h' });

router.post('/register', required(['nombre', 'email', 'password']), validEmailPassword, async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;
    const user = await User.create({ nombre, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(user), user: { id: user._id, nombre: user.nombre, email: user.email } });
  } catch (e) { next(e); }
});

router.post('/login', required(['email', 'password']), async (req, res, next) => {
  try {
    const user = await User.findOne({ email: String(req.body.email).toLowerCase() });
    // mismo mensaje para email o clave erróneos (no revelar cuál falló)
    if (!user || !(await bcrypt.compare(String(req.body.password), user.password))) throw httpError(401, 'Credenciales incorrectas');
    res.json({ token: sign(user), user: { id: user._id, nombre: user.nombre, email: user.email } });
  } catch (e) { next(e); }
});

module.exports = router;
