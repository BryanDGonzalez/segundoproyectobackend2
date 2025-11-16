/**
 * DTO (Data Transfer Object) para Cart
 */

class CartDTO {
  /**
   * DTO para carrito completo
   */
  static toDTO(cart) {
    if (!cart) return null;

    return {
      id: cart._id || cart.id,
      user: cart.user,
      products: cart.products.map(item => ({
        product: item.product,
        quantity: item.quantity
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };
  }

  /**
   * DTO para carrito con detalles de productos
   */
  static toDetailedDTO(cart) {
    if (!cart) return null;

    return {
      id: cart._id || cart.id,
      user: cart.user,
      products: cart.products.map(item => ({
        product: {
          id: item.product?._id || item.product?.id,
          title: item.product?.title,
          price: item.product?.price,
          code: item.product?.code,
          thumbnail: item.product?.thumbnails?.[0]
        },
        quantity: item.quantity,
        subtotal: item.product?.price ? item.product.price * item.quantity : 0
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };
  }
}

module.exports = CartDTO;


