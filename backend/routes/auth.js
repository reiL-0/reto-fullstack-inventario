const router = require('express').Router();
const c = require('../controllers/authController');
const { required, validEmailPassword } = require('../middleware/validate');

router.post('/register', required(['nombre', 'email', 'password']), validEmailPassword, c.register);
router.post('/login', required(['email', 'password']), c.login);

module.exports = router;
