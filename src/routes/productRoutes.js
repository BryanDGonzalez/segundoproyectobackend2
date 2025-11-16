const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateJWT, requireAdmin, requireAdminOrPremium } = require('../middleware/auth');

// Rutas públicas
router.get('/', productController.getAllProducts.bind(productController)); // Listar productos
router.get('/:id', productController.getProductById.bind(productController)); // Obtener producto por ID

// Rutas protegidas (solo admin o premium pueden crear/editar/eliminar)
router.post('/', authenticateJWT, requireAdminOrPremium, productController.createProduct.bind(productController)); // Crear producto
router.put('/:id', authenticateJWT, requireAdminOrPremium, productController.updateProduct.bind(productController)); // Actualizar producto
router.delete('/:id', authenticateJWT, requireAdminOrPremium, productController.deleteProduct.bind(productController)); // Eliminar producto

module.exports = router;

