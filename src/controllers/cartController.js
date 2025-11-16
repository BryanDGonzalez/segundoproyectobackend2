const cartService = require('../services/cartService');
const { sendSuccess, sendError, sendNotFoundError, sendValidationError } = require('../utils/responseUtils');

/**
 * Controller para Cart
 */
class CartController {
  /**
   * GET /api/carts
   * Obtener carrito del usuario actual
   */
  async getMyCart(req, res) {
    try {
      const userId = req.user._id.toString();
      const cart = await cartService.getCartByUser(userId);
      sendSuccess(res, 200, 'Carrito obtenido exitosamente', cart);
    } catch (error) {
      sendError(res, 500, 'Error al obtener carrito', error.message);
    }
  }

  /**
   * POST /api/carts/products/:pid
   * Agregar producto al carrito
   */
  async addProductToCart(req, res) {
    try {
      const userId = req.user._id.toString();
      const { pid } = req.params;
      const { quantity = 1 } = req.body;

      if (quantity <= 0) {
        return sendValidationError(res, [
          { field: 'quantity', message: 'La cantidad debe ser mayor a 0' }
        ]);
      }

      const cart = await cartService.addProductToCart(userId, pid, quantity);
      sendSuccess(res, 200, 'Producto agregado al carrito exitosamente', cart);
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('Stock insuficiente')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al agregar producto al carrito', error.message);
    }
  }

  /**
   * PUT /api/carts/products/:pid
   * Actualizar cantidad de producto en carrito
   */
  async updateProductQuantity(req, res) {
    try {
      const userId = req.user._id.toString();
      const { pid } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        return sendValidationError(res, [
          { field: 'quantity', message: 'La cantidad debe ser mayor a 0' }
        ]);
      }

      const cart = await cartService.updateProductQuantity(userId, pid, quantity);
      sendSuccess(res, 200, 'Cantidad actualizada exitosamente', cart);
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('Stock insuficiente')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al actualizar cantidad', error.message);
    }
  }

  /**
   * DELETE /api/carts/products/:pid
   * Eliminar producto del carrito
   */
  async removeProductFromCart(req, res) {
    try {
      const userId = req.user._id.toString();
      const { pid } = req.params;
      const cart = await cartService.removeProductFromCart(userId, pid);
      sendSuccess(res, 200, 'Producto eliminado del carrito exitosamente', cart);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return sendNotFoundError(res, error.message);
      }
      sendError(res, 500, 'Error al eliminar producto del carrito', error.message);
    }
  }

  /**
   * DELETE /api/carts
   * Vaciar carrito
   */
  async clearCart(req, res) {
    try {
      const userId = req.user._id.toString();
      await cartService.clearCart(userId);
      sendSuccess(res, 200, 'Carrito vaciado exitosamente');
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return sendNotFoundError(res, error.message);
      }
      sendError(res, 500, 'Error al vaciar carrito', error.message);
    }
  }
}

module.exports = new CartController();

