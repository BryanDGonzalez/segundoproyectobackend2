const userService = require('../services/userService');
const { sendSuccess, sendError, sendNotFoundError } = require('../utils/responseUtils');

/**
 * Controller para User
 */
class UserController {
  /**
   * POST /api/users
   * Crear nuevo usuario
   */
  async createUser(req, res) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;

      if (!first_name || !last_name || !email || !age || !password) {
        return sendError(res, 400, 'Todos los campos son obligatorios');
      }

      const userData = { first_name, last_name, email, age, password };
      if (role && req.user?.role === 'admin') {
        userData.role = role;
      }

      const user = await userService.createUser(userData);
      sendSuccess(res, 201, 'Usuario creado exitosamente', user);
    } catch (error) {
      if (error.message.includes('ya está registrado') || error.message.includes('ya existe')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al crear usuario', error.message);
    }
  }

  /**
   * GET /api/users
   * Obtener todos los usuarios
   */
  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      sendSuccess(res, 200, 'Usuarios obtenidos exitosamente', users);
    } catch (error) {
      sendError(res, 500, 'Error al obtener usuarios', error.message);
    }
  }

  /**
   * GET /api/users/:id
   * Obtener usuario por ID
   */
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      if (!user) {
        return sendNotFoundError(res, 'Usuario no encontrado');
      }

      sendSuccess(res, 200, 'Usuario obtenido exitosamente', user);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return sendNotFoundError(res, error.message);
      }
      sendError(res, 500, 'Error al obtener usuario', error.message);
    }
  }

  /**
   * PUT /api/users/:id
   * Actualizar usuario
   */
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Solo admin puede cambiar el rol
      if (updateData.role && req.user?.role !== 'admin') {
        delete updateData.role;
      }

      const user = await userService.updateUser(id, updateData);
      
      if (!user) {
        return sendNotFoundError(res, 'Usuario no encontrado');
      }

      sendSuccess(res, 200, 'Usuario actualizado exitosamente', user);
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('ya está en uso')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al actualizar usuario', error.message);
    }
  }

  /**
   * DELETE /api/users/:id
   * Eliminar usuario
   */
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);
      
      if (!result) {
        return sendNotFoundError(res, 'Usuario no encontrado');
      }

      sendSuccess(res, 200, 'Usuario eliminado exitosamente');
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return sendNotFoundError(res, error.message);
      }
      sendError(res, 500, 'Error al eliminar usuario', error.message);
    }
  }

  /**
   * PUT /api/users/:id/password
   * Cambiar contraseña
   */
  async changePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return sendError(res, 400, 'Contraseña actual y nueva contraseña son obligatorias');
      }

      const user = await userService.changePassword(id, currentPassword, newPassword);
      sendSuccess(res, 200, 'Contraseña actualizada exitosamente', user);
    } catch (error) {
      sendError(res, 400, error.message || 'Error al cambiar contraseña');
    }
  }
}

module.exports = new UserController();
