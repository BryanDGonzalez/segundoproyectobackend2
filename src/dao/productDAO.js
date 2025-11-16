const Product = require('../models/Product');

/**
 * DAO (Data Access Object) para Product
 * Capa de acceso a datos - solo operaciones CRUD básicas
 */
class ProductDAO {
  /**
   * Crear un nuevo producto
   */
  async create(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar producto por ID
   */
  async findById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar producto por código
   */
  async findByCode(code) {
    try {
      return await Product.findOne({ code: code.toUpperCase() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos los productos
   */
  async findAll(filter = {}, options = {}) {
    try {
      const { limit, skip, sort } = options;
      let query = Product.find(filter);

      if (skip) query = query.skip(skip);
      if (limit) query = query.limit(limit);
      if (sort) query = query.sort(sort);

      return await query.exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Contar productos
   */
  async count(filter = {}) {
    try {
      return await Product.countDocuments(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar producto por ID
   */
  async updateById(id, updateData) {
    try {
      return await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar producto por ID
   */
  async deleteById(id) {
    try {
      return await Product.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar stock de un producto
   */
  async updateStock(productId, quantity) {
    try {
      return await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: quantity } },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar stock disponible
   */
  async checkStock(productId, requiredQuantity) {
    try {
      const product = await this.findById(productId);
      if (!product) return false;
      return product.stock >= requiredQuantity;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductDAO();


