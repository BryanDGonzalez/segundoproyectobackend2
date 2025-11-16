const ticketDAO = require('../dao/ticketDAO');
const TicketDTO = require('../dto/ticketDTO');

/**
 * Repository para Ticket
 * Implementa el patrón Repository
 */
class TicketRepository {
  /**
   * Crear ticket
   */
  async create(ticketData) {
    try {
      const ticket = await ticketDAO.create(ticketData);
      return TicketDTO.toDTO(ticket);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar ticket por ID
   */
  async findById(id) {
    try {
      const ticket = await ticketDAO.findById(id);
      return ticket ? TicketDTO.toDetailedDTO(ticket) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar ticket por código
   */
  async findByCode(code) {
    try {
      const ticket = await ticketDAO.findByCode(code);
      return ticket ? TicketDTO.toDetailedDTO(ticket) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar tickets por comprador
   */
  async findByPurchaser(email) {
    try {
      const tickets = await ticketDAO.findByPurchaser(email);
      return tickets.map(ticket => TicketDTO.toDetailedDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos los tickets
   */
  async findAll(filter = {}, options = {}) {
    try {
      const tickets = await ticketDAO.findAll(filter, options);
      return tickets.map(ticket => TicketDTO.toDetailedDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Contar tickets
   */
  async count(filter = {}) {
    try {
      return await ticketDAO.count(filter);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketRepository();


