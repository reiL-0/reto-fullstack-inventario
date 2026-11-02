const Product = require('../models/Product');
const { httpError } = require('../middleware/error');

const fields = ({ nombre, descripcion, precio, stock }) => ({ nombre, descripcion, precio, stock });
const found = (p) => { if (!p) throw httpError(404, 'Producto no encontrado'); return p; };

exports.list = async (req, res, next) => {
  try { res.json(await Product.find().sort('-createdAt')); } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try { res.json(found(await Product.findById(req.params.id))); } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try { res.status(201).json(await Product.create({ ...fields(req.body), creadoPor: req.user.id })); } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    res.json(found(await Product.findByIdAndUpdate(req.params.id, fields(req.body), { new: true, runValidators: true, omitUndefined: true })));
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try { found(await Product.findByIdAndDelete(req.params.id)); res.json({ mensaje: 'Producto eliminado' }); } catch (e) { next(e); }
};
