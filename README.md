# Reto Full Stack – Fase 1: Gestor de Inventario

Aplicación full stack: API REST con **Node.js + Express + MongoDB (Mongoose)**, autenticación **JWT** y frontend en **HTML, CSS y JavaScript** servido por el mismo servidor.

## Enlaces de entrega (completar)
- Repositorio GitHub: https://github.com/reiL-0/reto-fullstack-inventario
- Despliegue en la nube: https://reto-fullstack-inventario.onrender.com
- Video demostrativo: https://youtu.be/bQm1LYak384

## Estructura

```
reto-fullstack/
├── package.json, .env.example, .gitignore, README.md
├── backend/
│   ├── server.js              # Arranque: Express, middlewares, rutas, conexión a MongoDB
│   ├── test.js                # Prueba de la API (npm test)
│   ├── models/                # User.js, Product.js (esquemas Mongoose)
│   ├── controllers/           # authController.js, productController.js (lógica)
│   ├── routes/                # auth.js, products.js (URL -> middleware -> controlador)
│   └── middleware/
│       ├── auth.js            # Verifica JWT
│       ├── validate.js        # Validación de campos
│       └── error.js           # 404 + manejador central de errores (JSON { error })
└── frontend/                  # HTML/CSS/JS estático, servido por Express
    ├── index.html, js/login.js    # Login / registro
    ├── app.html,  js/app.js       # Listado + CRUD de productos
    └── css/style.css
```

## Flujo del sistema

1. El usuario abre `index.html` y se **registra** (`POST /api/auth/register`) o **inicia sesión** (`POST /api/auth/login`).
2. El backend valida los datos, guarda/compara la contraseña con bcrypt y responde con un **token JWT**.
3. El frontend guarda el token en `localStorage` y redirige a `app.html`.
4. `app.js` pide la lista (`GET /api/products`, pública) y la dibuja en el DOM.
5. Al agregar, editar o eliminar, `app.js` envía la petición con `Authorization: Bearer <token>`. El middleware `auth.js` verifica el token; si es válido, el controlador opera sobre MongoDB y la lista se recarga.
6. Si el token falta o expiró (401), el frontend borra la sesión y vuelve al login. Cualquier error se devuelve como `{ "error": ... }` y se muestra en pantalla.

Petición típica: `Ruta (routes) → middleware (auth/validate) → controlador → modelo (Mongoose) → MongoDB → respuesta JSON`.

## Ejecutar en local

Requisitos: Node.js 18+, MongoDB local (o una cadena de MongoDB Atlas).

```bash
npm install
cp .env.example .env      # edita MONGO_URI y JWT_SECRET
npm start                 # http://localhost:3000
```

Variables de entorno (`.env`, nunca se sube a Git): `PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`.
El servidor no arranca si faltan `MONGO_URI` o `JWT_SECRET`.

## API

Base: `/api`. Las respuestas de error siempre son `{ "error": "mensaje" }`.
Rutas protegidas: cabecera `Authorization: Bearer <token>`.

| Método | Ruta | Auth | Cuerpo | Respuesta |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | `nombre, email, password (≥6)` | 201 `{ token, user }` · 400 · 409 email repetido |
| POST | `/api/auth/login` | No | `email, password` | 200 `{ token, user }` · 401 |
| GET | `/api/products` | No | – | 200 lista de productos |
| GET | `/api/products/:id` | No | – | 200 producto · 400 ID inválido · 404 |
| POST | `/api/products` | **Sí** | `nombre, precio, [descripcion, stock]` | 201 producto · 400 · 401 |
| PUT | `/api/products/:id` | **Sí** | campos a modificar | 200 producto · 400 · 401 · 404 |
| DELETE | `/api/products/:id` | **Sí** | – | 200 `{ mensaje }` · 401 · 404 |

Regla de negocio: la lectura es pública; crear, modificar y eliminar requieren iniciar sesión.

Ejemplo (Postman o curl):
```bash
curl -X POST localhost:3000/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"ana@x.com","password":"123456"}'
curl -X POST localhost:3000/api/products -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" -d '{"nombre":"Lápiz","precio":2,"stock":10}'
```

## Seguridad
- Contraseñas con hash **bcrypt** (nunca en texto plano).
- Token JWT firmado con `JWT_SECRET`, expira (por defecto 2 h).
- Mensaje único para credenciales incorrectas (no revela si el correo existe).
- El frontend escapa el HTML de los datos mostrados (evita XSS).

## Pruebas
`npm test` levanta MongoDB en memoria y verifica registro, login, validaciones, rutas protegidas y CRUD completo.

## Despliegue en la nube (Render + MongoDB Atlas)
1. Crea un clúster gratuito en MongoDB Atlas, un usuario de base de datos y permite acceso de red (0.0.0.0/0). Copia la cadena de conexión.
2. Sube el proyecto a GitHub (el `.gitignore` excluye `node_modules` y `.env`).
3. En Render: *New → Web Service* → conecta el repo. Build: `npm install`. Start: `npm start`.
4. En *Environment* agrega `MONGO_URI` (cadena de Atlas) y `JWT_SECRET`. Render define `PORT`.
5. Copia la URL pública generada y pégala en "Enlaces de entrega".

## Uso de IA (según lo pedido en el reto)
- **dotenv**: se consultó un ejemplo de configuración; se adaptó validando que las variables obligatorias existan al arrancar y excluyendo `.env` de Git.
- **CSS del login**: se evaluaron sugerencias (tarjeta centrada, degradado, foco visible, mensaje de error con `role="alert"`) y se conservaron las que mejoran legibilidad y accesibilidad.
- Todo el código generado fue revisado y probado (`npm test`).
