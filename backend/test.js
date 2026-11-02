// Prueba de humo de toda la API con MongoDB en memoria (no requiere instalar Mongo). Uso: npm test
const assert = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
process.env.JWT_SECRET = 'test-secret';

(async () => {
  const mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  const server = require('./server').listen(0);
  const base = `http://localhost:${server.address().port}/api`;
  const call = async (path, method = 'GET', body, token) => {
    const r = await fetch(base + path, {
      method, body: body && JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
    });
    return { status: r.status, data: await r.json() };
  };

  let r = await call('/auth/register', 'POST', { nombre: 'Ana', email: 'ana@x.com', password: '123456' });
  assert.equal(r.status, 201); const token = r.data.token;
  assert.equal((await call('/auth/register', 'POST', { nombre: 'Ana', email: 'ana@x.com', password: '123456' })).status, 409);
  assert.equal((await call('/auth/register', 'POST', { nombre: 'B', email: 'mal', password: '123456' })).status, 400);
  assert.equal((await call('/auth/login', 'POST', { email: 'ana@x.com', password: 'mala' })).status, 401);
  assert.equal((await call('/auth/login', 'POST', { email: 'ana@x.com', password: '123456' })).status, 200);

  assert.equal((await call('/products', 'POST', { nombre: 'Lápiz', precio: 2 })).status, 401); // sin token
  assert.equal((await call('/products', 'POST', { nombre: 'Lápiz' }, token)).status, 400);      // falta precio
  r = await call('/products', 'POST', { nombre: 'Lápiz', precio: 2, stock: 10 }, token);
  assert.equal(r.status, 201); const id = r.data._id;
  assert.equal((await call('/products')).data.length, 1);                                       // lectura abierta
  assert.equal((await call(`/products/${id}`)).data.nombre, 'Lápiz');
  assert.equal((await call(`/products/${id}`, 'PUT', { precio: 3 }, token)).data.precio, 3);
  assert.equal((await call(`/products/${id}`, 'PUT', { precio: -1 }, token)).status, 400);
  assert.equal((await call('/products/abc')).status, 400);
  assert.equal((await call(`/products/${id}`, 'DELETE', null, token)).status, 200);
  assert.equal((await call(`/products/${id}`)).status, 404);

  console.log('OK: todas las pruebas pasaron');
  server.close(); await mongoose.disconnect(); await mongo.stop();
})().catch((e) => { console.error(e); process.exit(1); });
