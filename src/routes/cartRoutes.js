const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateJWT } = require('../middleware/auth');

// Todas las rutas requieren autenticación (solo usuarios pueden usar carritos)
router.get('/', authenticateJWT, cartController.getMyCart.bind(cartController)); // Obtener mi carrito
router.post('/products/:pid', authenticateJWT, cartController.addProductToCart.bind(cartController)); // Agregar producto
router.put('/products/:pid', authenticateJWT, cartController.updateProductQuantity.bind(cartController)); // Actualizar cantidad
router.delete('/products/:pid', authenticateJWT, cartController.removeProductFromCart.bind(cartController)); // Eliminar producto
router.delete('/', authenticateJWT, cartController.clearCart.bind(cartController)); // Vaciar carrito

module.exports = router;

