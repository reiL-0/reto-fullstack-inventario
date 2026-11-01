const { Schema, model } = require('mongoose');

module.exports = model('User', new Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true } // hash bcrypt, nunca texto plano
}, { timestamps: true }));
