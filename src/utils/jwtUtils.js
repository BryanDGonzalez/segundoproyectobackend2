const jwt = require('jsonwebtoken');

/**
 * Utilidades para JWT
 */
class JWTUtils {
  /**
   * Generar token JWT
   */
  static generateToken(payload, expiresIn = null) {
    const options = {
      issuer: 'ecommerce-api'
    };

    if (expiresIn) {
      options.expiresIn = expiresIn;
    } else {
      options.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    }

    return jwt.sign(payload, process.env.JWT_SECRET, options);
  }

  /**
   * Generar token de reset de contraseña (válido por 1 hora)
   */
  static generateResetToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
      issuer: 'ecommerce-api'
    });
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'ecommerce-api'
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Decodificar token sin verificar (útil para debugging)
   */
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }
}

module.exports = JWTUtils;
