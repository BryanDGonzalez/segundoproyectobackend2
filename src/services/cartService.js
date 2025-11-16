const cartRepository = require('../repository/cartRepository');
const productRepository = require('../repository/productRepository');
const userRepository = require('../repository/userRepository');

/**
 * Service para Cart
 * Contiene la lógica de negocio
 */
class CartService {
  /**
   * Obtener carrito del usuario
   */
  async getCartByUser(userId) {
    try {
      return await cartRepository.findOrCreateByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Agregar producto al carrito
   */
  async addProductToCart(userId, productId, quantity = 1) {
    try {
      // Verificar que el producto existe
      const product = await productRepository.findById(productId);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Verificar stock disponible
      const hasStock = await productRepository.checkStock(productId, quantity);
      if (!hasStock) {
        throw new Error('Stock insuficiente');
      }

      // Obtener o crear carrito
      const cart = await cartRepository.findOrCreateByUser(userId);
      
      // Agregar producto al carrito
      return await cartRepository.addProduct(cart.id, productId, quantity);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar cantidad de producto en carrito
   */
  async updateProductQuantity(userId, productId, quantity) {
    try {
      if (quantity <= 0) {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      // Verificar stock disponible
      const hasStock = await productRepository.checkStock(productId, quantity);
      if (!hasStock) {
        throw new Error('Stock insuficiente');
      }

      const cart = await cartRepository.findByUser(userId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return await cartRepository.updateProductQuantity(cart.id, productId, quantity);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto del carrito
   */
  async removeProductFromCart(userId, productId) {
    try {
      const cart = await cartRepository.findByUser(userId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return await cartRepository.removeProduct(cart.id, productId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vaciar carrito
   */
  async clearCart(userId) {
    try {
      const cart = await cartRepository.findByUser(userId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      return await cartRepository.clearCart(cart.id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartService();

