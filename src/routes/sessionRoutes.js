const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT, validateCurrentUser } = require('../middleware/auth');

// Rutas públicas (no requieren autenticación)
router.post('/register', authController.register.bind(authController)); // Registro de usuario
router.post('/login', authController.login.bind(authController)); // Inicio de sesión
router.post('/request-password-reset', authController.requestPasswordReset.bind(authController)); // Solicitar recuperación
router.post('/reset-password', authController.resetPassword.bind(authController)); // Resetear contraseña

// Rutas protegidas (requieren autenticación)
router.post('/logout', authenticateJWT, authController.logout.bind(authController)); // Cerrar sesión
router.get('/current', validateCurrentUser, authController.getCurrentUser.bind(authController)); // Obtener usuario actual

module.exports = router;
