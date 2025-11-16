/**
 * DTO (Data Transfer Object) para Product
 */

class ProductDTO {
  /**
   * DTO para producto completo
   */
  static toDTO(product) {
    if (!product) return null;

    return {
      id: product._id || product.id,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails,
      owner: product.owner,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };
  }

  /**
   * DTO para lista de productos
   */
  static toListDTO(product) {
    if (!product) return null;

    return {
      id: product._id || product.id,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: product.status,
      stock: product.stock,
      category: product.category,
      thumbnails: product.thumbnails
    };
  }
}

module.exports = ProductDTO;


