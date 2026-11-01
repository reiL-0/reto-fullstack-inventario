require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { notFound, errorHandler } = require('./src/middleware/error');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api', notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  for (const k of ['MONGO_URI', 'JWT_SECRET']) {
    if (!process.env[k]) { console.error(`Falta la variable de entorno ${k} (ver .env.example)`); process.exit(1); }
  }
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
    })
    .catch((e) => { console.error('Error conectando a MongoDB:', e.message); process.exit(1); });
}
