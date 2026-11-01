# Reto Full Stack – Fase 1: Gestor de Inventario

Aplicación full stack: API REST con **Node.js + Express + MongoDB (Mongoose)**, autenticación **JWT** y frontend en **HTML, CSS y JavaScript** servido por el mismo servidor.

## Enlaces de entrega (completar)
- Repositorio GitHub: `https://github.com/<usuario>/<repo>`
- Despliegue en la nube: `https://<tu-app>.onrender.com`
- Video demostrativo: `<enlace>`

## Estructura

```
reto-fullstack/
├── server.js                  # Arranque: Express, middlewares, rutas, conexión a MongoDB
├── test.js                    # Prueba de humo de la API (npm test)
├── .env.example               # Plantilla de variables de entorno
├── src/
│   ├── models/                # User.js, Product.js (esquemas Mongoose)
│   ├── routes/                # auth.js (registro/login), products.js (CRUD)
│   └── middleware/
│       ├── auth.js            # Verifica JWT
│       ├── validate.js        # Validación de campos
│       └── error.js           # 404 + manejador central de errores (JSON { error })
└── public/                    # Frontend
    ├── index.html, js/login.js    # Login / registro
    ├── app.html,  js/app.js       # Listado + CRUD de productos
    └── css/style.css
```

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
