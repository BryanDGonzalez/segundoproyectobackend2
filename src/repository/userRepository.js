const userDAO = require('../dao/userDAO');
const UserDTO = require('../dto/userDTO');

/**
 * Repository para User
 * Implementa el patrón Repository
 * Separa la lógica de negocio del acceso a datos
 */
class UserRepository {
  /**
   * Crear usuario
   */
  async create(userData) {
    try {
      const user = await userDAO.create(userData);
      return UserDTO.toResponseDTO(user);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por ID
   */
  async findById(id) {
    try {
      const user = await userDAO.findById(id);
      return user ? UserDTO.toPublicDTO(user) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por email (con contraseña para autenticación)
   */
  async findByEmail(email) {
    try {
      return await userDAO.findByEmailWithPassword(email);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos los usuarios
   */
  async findAll(filter = {}) {
    try {
      const users = await userDAO.findAll(filter);
      return users.map(user => UserDTO.toListDTO(user));
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  async updateById(id, updateData) {
    try {
      const user = await userDAO.updateById(id, updateData);
      return user ? UserDTO.toResponseDTO(user) : null;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar usuario
   */
  async deleteById(id) {
    try {
      return await userDAO.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por token de reset
   */
  async findByResetToken(token) {
    try {
      return await userDAO.findByResetToken(token);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar token de reset
   */
  async updateResetToken(userId, token, expires) {
    try {
      return await userDAO.updateResetToken(userId, token, expires);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Limpiar token de reset
   */
  async clearResetToken(userId) {
    try {
      return await userDAO.clearResetToken(userId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar si el email existe
   */
  async emailExists(email) {
    try {
      const user = await userDAO.findByEmail(email);
      return !!user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();


