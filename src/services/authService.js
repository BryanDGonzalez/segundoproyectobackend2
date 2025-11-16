const userRepository = require('../repository/userRepository');
const JWTUtils = require('../utils/jwtUtils');
const PasswordUtils = require('../utils/passwordUtils');
const mailer = require('../utils/mailer');
const userService = require('./userService');

/**
 * Service para Autenticación
 * Contiene la lógica de negocio relacionada con autenticación
 */
class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(userData) {
    try {
      const user = await userService.createUser(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login de usuario
   */
  async login(email, password) {
    try {
      // Buscar usuario con contraseña
      const user = await userRepository.findByEmail(email);
      
      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Verificar contraseña
      const isMatch = PasswordUtils.comparePassword(password, user.password);
      if (!isMatch) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Generar token JWT
      const token = JWTUtils.generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role
      });

      // Retornar usuario (sin contraseña) y token
      const userDTO = await userRepository.findById(user._id.toString());
      return {
        user: userDTO,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuario actual (desde token)
   */
  async getCurrentUser(userId) {
    try {
      const user = await userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async requestPasswordReset(email) {
    try {
      const user = await userRepository.findByEmail(email);
      if (!user) {
        // Por seguridad, no revelamos si el email existe o no
        return { message: 'Si el email existe, recibirás un correo con las instrucciones' };
      }

      // Generar token de reset (válido por 1 hora)
      const resetToken = JWTUtils.generateResetToken({
        id: user._id.toString(),
        email: user.email
      });

      // Guardar token en la base de datos
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 1 hora

      await userRepository.updateResetToken(user._id.toString(), resetToken, expires);

      // Enviar correo
      try {
        await mailer.sendPasswordResetEmail(user.email, resetToken);
      } catch (mailError) {
        console.error('Error al enviar correo:', mailError);
        // Limpiar token si falla el envío
        await userRepository.clearResetToken(user._id.toString());
        throw new Error('Error al enviar correo de recuperación');
      }

      return { message: 'Si el email existe, recibirás un correo con las instrucciones' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resetear contraseña con token
   */
  async resetPassword(token, newPassword) {
    try {
      // Verificar token
      const decoded = JWTUtils.verifyToken(token);
      if (!decoded) {
        throw new Error('Token inválido o expirado');
      }

      // Buscar usuario por token en BD (doble verificación)
      const user = await userRepository.findByResetToken(token);
      if (!user) {
        throw new Error('Token inválido o expirado');
      }

      // Verificar que no sea la misma contraseña anterior
      const isSamePassword = PasswordUtils.comparePassword(newPassword, user.password);
      if (isSamePassword) {
        throw new Error('La nueva contraseña debe ser diferente a la anterior');
      }

      // Validar nueva contraseña
      const passwordValidation = PasswordUtils.validatePasswordStrength(newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Actualizar contraseña
      await userRepository.updateById(user._id.toString(), {
        password: PasswordUtils.hashPassword(newPassword),
        lastPasswordChange: new Date()
      });

      // Limpiar token de reset
      await userRepository.clearResetToken(user._id.toString());

      return { message: 'Contraseña restablecida exitosamente' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AuthService();


