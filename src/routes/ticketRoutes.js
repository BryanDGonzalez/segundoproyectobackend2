const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticateJWT } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.get('/', authenticateJWT, ticketController.getTickets.bind(ticketController)); // Obtener tickets
router.get('/:id', authenticateJWT, ticketController.getTicketById.bind(ticketController)); // Obtener ticket por ID

module.exports = router;

