const productRepository = require('../repository/productRepository');

/**
 * Service para Product
 * Contiene la lógica de negocio
 */
class ProductService {
  /**
   * Crear producto
   */
  async createProduct(productData, ownerId = null) {
    try {
      // Verificar si el código ya existe
      const codeExists = await productRepository.codeExists(productData.code);
      if (codeExists) {
        throw new Error('El código del producto ya existe');
      }

      // Si hay owner, asignarlo
      if (ownerId) {
        productData.owner = ownerId;
      }

      return await productRepository.create(productData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener producto por ID
   */
  async getProductById(id) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los productos con paginación
   */
  async getAllProducts(filter = {}, options = {}) {
    try {
      const { page = 1, limit = 10, sort = {} } = options;
      const skip = (page - 1) * limit;

      const products = await productRepository.findAll(filter, {
        skip,
        limit: parseInt(limit),
        sort
      });

      const total = await productRepository.count(filter);

      return {
        products,
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

  /**
   * Actualizar producto
   */
  async updateProduct(id, updateData, userId, userRole) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Solo admin puede actualizar cualquier producto
      // Premium/admin puede actualizar sus propios productos
      if (userRole !== 'admin') {
        if (product.owner && product.owner.toString() !== userId) {
          throw new Error('No tienes permisos para actualizar este producto');
        }
      }

      // No permitir cambiar código si ya existe
      if (updateData.code && updateData.code !== product.code) {
        const codeExists = await productRepository.codeExists(updateData.code);
        if (codeExists) {
          throw new Error('El código del producto ya existe');
        }
      }

      return await productRepository.updateById(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto
   */
  async deleteProduct(id, userId, userRole) {
    try {
      const product = await productRepository.findById(id);
      if (!product) {
        throw new Error('Producto no encontrado');
      }

      // Solo admin puede eliminar cualquier producto
      // Premium/admin puede eliminar sus propios productos
      if (userRole !== 'admin') {
        if (product.owner && product.owner.toString() !== userId) {
          throw new Error('No tienes permisos para eliminar este producto');
        }
      }

      return await productRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar stock disponible
   */
  async checkStock(productId, quantity) {
    try {
      return await productRepository.checkStock(productId, quantity);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar stock
   */
  async updateStock(productId, quantity) {
    try {
      return await productRepository.updateStock(productId, quantity);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();

