const ticketService = require('../services/ticketService');
const { sendSuccess, sendError, sendNotFoundError } = require('../utils/responseUtils');

/**
 * Controller para Ticket
 */
class TicketController {
  /**
   * POST /api/carts/purchase
   * Procesar compra del carrito
   */
  async processPurchase(req, res) {
    try {
      const userId = req.user._id.toString();
      const userEmail = req.user.email;

      const result = await ticketService.processPurchase(userId, userEmail);
      
      sendSuccess(res, 200, result.message, {
        ticket: result.ticket,
        unavailableProducts: result.unavailableProducts
      });
    } catch (error) {
      if (error.message.includes('vacío')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al procesar compra', error.message);
    }
  }

  /**
   * GET /api/tickets/:id
   * Obtener ticket por ID
   */
  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await ticketService.getTicketById(id);
      
      if (!ticket) {
        return sendNotFoundError(res, 'Ticket no encontrado');
      }

      sendSuccess(res, 200, 'Ticket obtenido exitosamente', ticket);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return sendNotFoundError(res, error.message);
      }
      sendError(res, 500, 'Error al obtener ticket', error.message);
    }
  }

  /**
   * GET /api/tickets
   * Obtener tickets del usuario actual o todos (admin)
   */
  async getTickets(req, res) {
    try {
      if (req.user.role === 'admin') {
        // Admin puede ver todos los tickets
        const { page = 1, limit = 10 } = req.query;
        const result = await ticketService.getAllTickets({}, {
          page: parseInt(page),
          limit: parseInt(limit)
        });
        sendSuccess(res, 200, 'Tickets obtenidos exitosamente', result);
      } else {
        // Usuario normal solo ve sus tickets
        const tickets = await ticketService.getTicketsByUser(req.user.email);
        sendSuccess(res, 200, 'Tickets obtenidos exitosamente', tickets);
      }
    } catch (error) {
      sendError(res, 500, 'Error al obtener tickets', error.message);
    }
  }
}

module.exports = new TicketController();

