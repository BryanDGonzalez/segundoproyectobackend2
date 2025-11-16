const User = require('../models/User');

/**
 * DAO (Data Access Object) para User
 * Capa de acceso a datos - solo operaciones CRUD básicas
 */
class UserDAO {
  /**
   * Crear un nuevo usuario
   */
  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por ID
   */
  async findById(id) {
    try {
      return await User.findById(id).select('-password');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar todos los usuarios
   */
  async findAll(filter = {}) {
    try {
      return await User.find(filter).select('-password');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar usuario por ID
   */
  async updateById(id, updateData) {
    try {
      return await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar usuario por ID
   */
  async deleteById(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario con contraseña (para autenticación)
   */
  async findByEmailWithPassword(email) {
    try {
      return await User.findOne({ email: email.toLowerCase() });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Buscar usuario por token de reset
   */
  async findByResetToken(token) {
    try {
      return await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar token de reset de contraseña
   */
  async updateResetToken(userId, token, expires) {
    try {
      return await User.findByIdAndUpdate(
        userId,
        {
          resetPasswordToken: token,
          resetPasswordExpires: expires
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Limpiar token de reset
   */
  async clearResetToken(userId) {
    try {
      return await User.findByIdAndUpdate(
        userId,
        {
          resetPasswordToken: null,
          resetPasswordExpires: null
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserDAO();


