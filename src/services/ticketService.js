const ticketRepository = require('../repository/ticketRepository');
const cartRepository = require('../repository/cartRepository');
const productRepository = require('../repository/productRepository');
const cartDAO = require('../dao/cartDAO');
const Ticket = require('../models/Ticket');

/**
 * Service para Ticket
 * Contiene la lógica de negocio para compras
 */
class TicketService {
  /**
   * Procesar compra del carrito
   */
  async processPurchase(userId, userEmail) {
    try {
      // Obtener carrito del usuario directamente del DAO (necesitamos el objeto completo)
      const cart = await cartDAO.findByUser(userId);
      if (!cart || !cart.products || cart.products.length === 0) {
        throw new Error('El carrito está vacío');
      }

      const cartId = cart._id || cart.id;

      // Verificar stock y separar productos disponibles y no disponibles
      const availableProducts = [];
      const unavailableProducts = [];
      let totalAmount = 0;

      // Obtener producto directamente del DAO para tener acceso completo
      const productDAO = require('../dao/productDAO');
      
      for (const item of cart.products) {
        const productId = item.product._id || item.product;
        const fullProduct = await productDAO.findById(productId.toString());
        
        if (!fullProduct) {
          unavailableProducts.push({
            product: productId,
            quantity: item.quantity,
            reason: 'Producto no encontrado'
          });
          continue;
        }

        const requestedQuantity = item.quantity;
        const availableStock = fullProduct.stock || 0;

        if (availableStock >= requestedQuantity) {
          // Producto disponible
          const subtotal = fullProduct.price * requestedQuantity;
          totalAmount += subtotal;

          availableProducts.push({
            product: fullProduct._id || fullProduct.id,
            quantity: requestedQuantity,
            price: fullProduct.price
          });

          // Actualizar stock
          await productDAO.updateStock(fullProduct._id || fullProduct.id, -requestedQuantity);
        } else {
          // Producto sin stock suficiente
          unavailableProducts.push({
            product: fullProduct._id || fullProduct.id,
            quantity: requestedQuantity,
            availableStock,
            reason: 'Stock insuficiente'
          });
        }
      }

      // Si hay productos disponibles, crear ticket
      let ticket = null;
      if (availableProducts.length > 0) {
        const ticketCode = Ticket.generateCode();
        
        ticket = await ticketRepository.create({
          code: ticketCode,
          amount: totalAmount,
          purchaser: userEmail,
          products: availableProducts,
          purchase_datetime: new Date()
        });
      }

      // Actualizar carrito: dejar solo productos no disponibles
      if (unavailableProducts.length > 0) {
        const updatedProducts = unavailableProducts.map(item => ({
          product: item.product,
          quantity: item.quantity
        }));
        await cartDAO.updateById(cartId, { products: updatedProducts });
      } else {
        // Si todos los productos se compraron, vaciar carrito
        await cartRepository.clearCart(cartId);
      }

      return {
        ticket,
        unavailableProducts: unavailableProducts.length > 0 ? unavailableProducts : null,
        message: unavailableProducts.length > 0 
          ? 'Compra procesada parcialmente. Algunos productos no tenían stock suficiente.'
          : 'Compra procesada exitosamente'
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener ticket por ID
   */
  async getTicketById(id) {
    try {
      const ticket = await ticketRepository.findById(id);
      if (!ticket) {
        throw new Error('Ticket no encontrado');
      }
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener tickets del usuario
   */
  async getTicketsByUser(email) {
    try {
      return await ticketRepository.findByPurchaser(email);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los tickets (admin)
   */
  async getAllTickets(filter = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sort = { purchase_datetime: -1 } } = options;
      const skip = (page - 1) * limit;

      const tickets = await ticketRepository.findAll(filter, {
        skip,
        limit: parseInt(limit),
        sort
      });

      const total = await ticketRepository.count(filter);

      return {
        tickets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TicketService();

