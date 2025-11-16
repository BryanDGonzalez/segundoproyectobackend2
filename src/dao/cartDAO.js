const Cart = require('../models/Cart');

/**
 * DAO (Data Access Object) para Cart
 * Capa de acceso a datos - solo operaciones CRUD básicas
 */
class CartDAO {
  /**
   * Crear un nuevo carrito
   */
  async create(cartData) {
    try {
      const cart = new Cart(cartData);
      return await cart.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar carrito por ID
   */
  async findById(id) {
    try {
      return await Cart.findById(id).populate('products.product');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar carrito por usuario
   */
  async findByUser(userId) {
    try {
      return await Cart.findOne({ user: userId }).populate('products.product');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear o encontrar carrito de usuario
   */
  async findOrCreateByUser(userId) {
    try {
      let cart = await this.findByUser(userId);
      if (!cart) {
        cart = await this.create({ user: userId, products: [] });
      }
      return cart;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar carrito por ID
   */
  async updateById(id, updateData) {
    try {
      return await Cart.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      ).populate('products.product');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Agregar producto al carrito
   */
  async addProduct(cartId, productId, quantity = 1) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      return await cart.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar cantidad de producto en carrito
   */
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      const productIndex = cart.products.findIndex(
        item => item.product.toString() === productId.toString()
      );

      if (productIndex >= 0) {
        if (quantity <= 0) {
          cart.products.splice(productIndex, 1);
        } else {
          cart.products[productIndex].quantity = quantity;
        }
        return await cart.save();
      }

      throw new Error('Producto no encontrado en el carrito');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto del carrito
   */
  async removeProduct(cartId, productId) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      cart.products = cart.products.filter(
        item => item.product.toString() !== productId.toString()
      );

      return await cart.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vaciar carrito
   */
  async clearCart(cartId) {
    try {
      return await Cart.findByIdAndUpdate(
        cartId,
        { products: [] },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar carrito por ID
   */
  async deleteById(id) {
    try {
      return await Cart.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartDAO();


