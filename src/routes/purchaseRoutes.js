const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateJWT } = require('../middleware/auth');

// Ruta para procesar compra (requiere autenticación)
router.post('/purchase', authenticateJWT, ticketController.processPurchase.bind(ticketController)); // Procesar compra

module.exports = router;

