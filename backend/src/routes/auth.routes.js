const express = require('express');
const authController = require('../controllers/auth.controller');
const { validateRequest } = require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { registrationValidation, loginValidation } = require('../validations/auth.validation');

const router = express.Router();

router.post('/register/user', registrationValidation, validateRequest, authController.registerUser);
router.post('/register/seller', registrationValidation, validateRequest, authController.registerSeller);
router.post('/login', loginValidation, validateRequest, authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
