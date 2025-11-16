const productService = require('../services/productService');
const { sendSuccess, sendError, sendNotFoundError, sendValidationError } = require('../utils/responseUtils');

/**
 * Controller para Product
 */
class ProductController {
  /**
   * POST /api/products
   * Crear nuevo producto (solo admin)
   */
  async createProduct(req, res) {
    try {
      const { title, description, code, price, stock, category, thumbnails } = req.body;

      if (!title || !description || !code || !price || !stock || !category) {
        return sendValidationError(res, [
          { field: 'general', message: 'Todos los campos obligatorios deben ser proporcionados' }
        ]);
      }

      const product = await productService.createProduct(
        { title, description, code, price, stock, category, thumbnails },
        req.user?._id
      );

      sendSuccess(res, 201, 'Producto creado exitosamente', product);
    } catch (error) {
      if (error.message.includes('ya existe')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al crear producto', error.message);
    }
  }

  /**
   * GET /api/products
   * Obtener todos los productos con paginación
   */
  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, category, status, sort } = req.query;
      
      const filter = {};
      if (category) filter.category = category;
      if (status !== undefined) filter.status = status === 'true';

      const sortOption = sort ? { [sort]: 1 } : { createdAt: -1 };

      const result = await productService.getAllProducts(filter, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sortOption
      });

      sendSuccess(res, 200, 'Productos obtenidos exitosamente', result);
    } catch (error) {
      sendError(res, 500, 'Error al obtener productos', error.message);
    }
  }

  /**
   * GET /api/products/:id
   * Obtener producto por ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      
      if (!product) {
        return sendNotFoundError(res, 'Producto no encontrado');
      }

      sendSuccess(res, 200, 'Producto obtenido exitosamente', product);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return sendNotFoundError(res, error.message);
      }
      sendError(res, 500, 'Error al obtener producto', error.message);
    }
  }

  /**
   * PUT /api/products/:id
   * Actualizar producto (solo admin o owner)
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await productService.updateProduct(
        id,
        updateData,
        req.user._id.toString(),
        req.user.role
      );
      
      if (!product) {
        return sendNotFoundError(res, 'Producto no encontrado');
      }

      sendSuccess(res, 200, 'Producto actualizado exitosamente', product);
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('permisos')) {
        return sendError(res, 403, error.message);
      }
      if (error.message.includes('ya existe')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al actualizar producto', error.message);
    }
  }

  /**
   * DELETE /api/products/:id
   * Eliminar producto (solo admin o owner)
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const result = await productService.deleteProduct(
        id,
        req.user._id.toString(),
        req.user.role
      );
      
      if (!result) {
        return sendNotFoundError(res, 'Producto no encontrado');
      }

      sendSuccess(res, 200, 'Producto eliminado exitosamente');
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('permisos')) {
        return sendError(res, 403, error.message);
      }
      sendError(res, 500, 'Error al eliminar producto', error.message);
    }
  }
}

module.exports = new ProductController();

