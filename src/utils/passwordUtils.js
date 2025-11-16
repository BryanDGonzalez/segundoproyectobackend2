const bcrypt = require('bcrypt');

/**
 * Utilidades para contraseñas
 */
class PasswordUtils {
  /**
   * Hash de contraseña usando bcrypt.hashSync
   */
  static hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  /**
   * Comparar contraseña usando bcrypt.compareSync
   */
  static comparePassword(candidatePassword, hashedPassword) {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
  }

  /**
   * Validar fortaleza de contraseña
   */
  static validatePasswordStrength(password) {
    if (password.length < 6) {
      return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }
    return { valid: true };
  }
}

module.exports = PasswordUtils;
