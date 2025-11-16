const userRepository = require('../repository/userRepository');
const cartDAO = require('../dao/cartDAO');
const PasswordUtils = require('../utils/passwordUtils');

/**
 * Service para User
 * Contiene la lógica de negocio
 */
class UserService {
  /**
   * Crear usuario
   */
  async createUser(userData) {
    try {
      // Verificar si el email ya existe
      const emailExists = await userRepository.emailExists(userData.email);
      if (emailExists) {
        throw new Error('El email ya está registrado');
      }

      // Validar contraseña
      const passwordValidation = PasswordUtils.validatePasswordStrength(userData.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Crear usuario
      const user = await userRepository.create(userData);

      // Crear carrito para el usuario
      const cart = await cartDAO.create({ user: user.id, products: [] });
      
      // Asociar carrito al usuario
      await userRepository.updateById(user.id, { cart: cart._id });

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id) {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async getAllUsers(filter = {}) {
    try {
      return await userRepository.findAll(filter);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar usuario
   */
  async updateUser(id, updateData) {
    try {
      // No permitir actualizar email si ya existe
      if (updateData.email) {
        const emailExists = await userRepository.emailExists(updateData.email);
        if (emailExists) {
          const existingUser = await userRepository.findByEmail(updateData.email);
          if (existingUser && existingUser._id.toString() !== id) {
            throw new Error('El email ya está en uso');
          }
        }
      }

      // Si se actualiza la contraseña, validarla y hashearla
      if (updateData.password) {
        const passwordValidation = PasswordUtils.validatePasswordStrength(updateData.password);
        if (!passwordValidation.valid) {
          throw new Error(passwordValidation.message);
        }
        updateData.password = PasswordUtils.hashPassword(updateData.password);
        updateData.lastPasswordChange = new Date();
      }

      const user = await userRepository.updateById(id, updateData);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(id) {
    try {
      const user = await userRepository.findById(id);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Eliminar carrito asociado si existe
      if (user.cart) {
        await cartDAO.deleteById(user.cart);
      }

      return await userRepository.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Necesitamos el usuario con password, usar DAO directamente
      const userDAO = require('../dao/userDAO');
      const user = await userDAO.findById(userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      // Obtener usuario con contraseña para verificar
      const userWithPassword = await userDAO.findByEmailWithPassword(user.email);
      if (!userWithPassword) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isMatch = PasswordUtils.comparePassword(currentPassword, userWithPassword.password);
      if (!isMatch) {
        throw new Error('Contraseña actual incorrecta');
      }

      // Verificar que no sea la misma contraseña
      const isSamePassword = PasswordUtils.comparePassword(newPassword, userWithPassword.password);
      if (isSamePassword) {
        throw new Error('La nueva contraseña debe ser diferente a la actual');
      }

      // Validar nueva contraseña
      const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Actualizar contraseña
      return await userRepository.updateById(userId, {
        password: PasswordUtils.hashPassword(newPassword),
        lastPasswordChange: new Date()
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();


