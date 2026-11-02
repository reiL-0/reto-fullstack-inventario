const { Schema, model } = require('mongoose');

module.exports = model('Product', new Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, trim: true, default: '' },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  creadoPor: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));
