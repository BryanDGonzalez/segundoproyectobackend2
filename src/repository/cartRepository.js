const cartDAO = require('../dao/cartDAO');
const CartDTO = require('../dto/cartDTO');

/**
 * Repository para Cart
 * Implementa el patrón Repository
 */
class CartRepository {
  /**
   * Crear carrito
   */
  async create(cartData) {
    try {
      const cart = await cartDAO.create(cartData);
      return CartDTO.toDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar carrito por ID
   */
  async findById(id) {
    try {
      const cart = await cartDAO.findById(id);
      return cart ? CartDTO.toDetailedDTO(cart) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar carrito por usuario
   */
  async findByUser(userId) {
    try {
      const cart = await cartDAO.findByUser(userId);
      return cart ? CartDTO.toDetailedDTO(cart) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear o encontrar carrito de usuario
   */
  async findOrCreateByUser(userId) {
    try {
      const cart = await cartDAO.findOrCreateByUser(userId);
      return CartDTO.toDetailedDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Agregar producto al carrito
   */
  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await cartDAO.addProduct(cartId, productId, quantity);
      return CartDTO.toDetailedDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar cantidad de producto
   */
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
      return CartDTO.toDetailedDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto del carrito
   */
  async removeProduct(cartId, productId) {
    try {
      const cart = await cartDAO.removeProduct(cartId, productId);
      return CartDTO.toDetailedDTO(cart);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vaciar carrito
   */
  async clearCart(cartId) {
    try {
      return await cartDAO.clearCart(cartId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar carrito
   */
  async deleteById(id) {
    try {
      return await cartDAO.deleteById(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartRepository();


