const Ticket = require('../models/Ticket');

/**
 * DAO (Data Access Object) para Ticket
 * Capa de acceso a datos - solo operaciones CRUD básicas
 */
class TicketDAO {
  /**
   * Crear un nuevo ticket
   */
  async create(ticketData) {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar ticket por ID
   */
  async findById(id) {
    try {
      return await Ticket.findById(id).populate('products.product');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar ticket por código
   */
  async findByCode(code) {
    try {
      return await Ticket.findOne({ code }).populate('products.product');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar tickets por comprador
   */
  async findByPurchaser(email) {
    try {
      return await Ticket.find({ purchaser: email.toLowerCase() })
        .populate('products.product')
        .sort({ purchase_datetime: -1 });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos los tickets
   */
  async findAll(filter = {}, options = {}) {
    try {
      const { limit, skip, sort } = options;
      let query = Ticket.find(filter).populate('products.product');

      if (skip) query = query.skip(skip);
      if (limit) query = query.limit(limit);
      if (sort) query = query.sort(sort);

      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Contar tickets
   */
  async count(filter = {}) {
    try {
      return await Ticket.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketDAO();


