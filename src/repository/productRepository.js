const productDAO = require('../dao/productDAO');
const ProductDTO = require('../dto/productDTO');

/**
 * Repository para Product
 * Implementa el patrón Repository
 */
class ProductRepository {
  /**
   * Crear producto
   */
  async create(productData) {
    try {
      const product = await productDAO.create(productData);
      return ProductDTO.toDTO(product);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar producto por ID
   */
  async findById(id) {
    try {
      const product = await productDAO.findById(id);
      return product ? ProductDTO.toDTO(product) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar producto por código
   */
  async findByCode(code) {
    try {
      const product = await productDAO.findByCode(code);
      return product ? ProductDTO.toDTO(product) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos los productos con paginación
   */
  async findAll(filter = {}, options = {}) {
    try {
      const products = await productDAO.findAll(filter, options);
      return products.map(product => ProductDTO.toListDTO(product));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Contar productos
   */
  async count(filter = {}) {
    try {
      return await productDAO.count(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar producto
   */
  async updateById(id, updateData) {
    try {
      const product = await productDAO.updateById(id, updateData);
      return product ? ProductDTO.toDTO(product) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto
   */
  async deleteById(id) {
    try {
      return await productDAO.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar stock disponible
   */
  async checkStock(productId, requiredQuantity) {
    try {
      return await productDAO.checkStock(productId, requiredQuantity);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar stock
   */
  async updateStock(productId, quantity) {
    try {
      return await productDAO.updateStock(productId, quantity);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si el código existe
   */
  async codeExists(code) {
    try {
      const product = await productDAO.findByCode(code);
      return !!product;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductRepository();


