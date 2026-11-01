const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { httpError } = require('../middleware/error');
const { required } = require('../middleware/validate');

const fields = ({ nombre, descripcion, precio, stock }) => ({ nombre, descripcion, precio, stock });
const found = (p) => p || (() => { throw httpError(404, 'Producto no encontrado'); })();

// Lectura abierta
router.get('/', async (req, res, next) => {
  try { res.json(await Product.find().sort('-createdAt')); } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try { res.json(found(await Product.findById(req.params.id))); } catch (e) { next(e); }
});

// Crear / modificar / eliminar: requieren JWT
router.post('/', auth, required(['nombre', 'precio']), async (req, res, next) => {
  try { res.status(201).json(await Product.create({ ...fields(req.body), creadoPor: req.user.id })); } catch (e) { next(e); }
});
router.put('/:id', auth, async (req, res, next) => {
  try {
    res.json(found(await Product.findByIdAndUpdate(req.params.id, fields(req.body), { new: true, runValidators: true, omitUndefined: true })));
  } catch (e) { next(e); }
});
router.delete('/:id', auth, async (req, res, next) => {
  try { found(await Product.findByIdAndDelete(req.params.id)); res.json({ mensaje: 'Producto eliminado' }); } catch (e) { next(e); }
});

module.exports = router;
