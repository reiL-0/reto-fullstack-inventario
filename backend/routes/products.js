const router = require('express').Router();
const c = require('../controllers/productController');
const auth = require('../middleware/auth');
const { required } = require('../middleware/validate');

// Lectura abierta
router.get('/', c.list);
router.get('/:id', c.get);

// Crear / modificar / eliminar: requieren JWT
router.post('/', auth, required(['nombre', 'precio']), c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;
