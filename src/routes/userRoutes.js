const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { 
  authenticateJWT, 
  requireAdmin, 
  requireOwnershipOrAdmin 
} = require('../middleware/auth');

// Rutas públicas (no requieren autenticación)
router.post('/', userController.createUser.bind(userController)); // Crear usuario

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateJWT, requireAdmin, userController.getAllUsers.bind(userController)); // Listar usuarios (solo admin)

// Rutas protegidas con validación de propiedad o admin
router.get('/:id', authenticateJWT, requireOwnershipOrAdmin(), userController.getUserById.bind(userController)); // Obtener usuario por ID
router.put('/:id', authenticateJWT, requireOwnershipOrAdmin(), userController.updateUser.bind(userController)); // Actualizar usuario
router.delete('/:id', authenticateJWT, requireAdmin, userController.deleteUser.bind(userController)); // Eliminar usuario (solo admin)
router.put('/:id/password', authenticateJWT, requireOwnershipOrAdmin(), userController.changePassword.bind(userController)); // Cambiar contraseña

module.exports = router;
