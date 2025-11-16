const passport = require('../config/passport');
const { sendAuthError } = require('../utils/responseUtils');

/**
 * Middleware para autenticación JWT
 * Verifica que el usuario esté autenticado
 */
const authenticateJWT = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return sendAuthError(res, 'Error de autenticación');
    }
    
    if (!user) {
      return sendAuthError(res, info?.message || 'Token inválido o expirado');
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware para validar usuario actual
 * Similar a authenticateJWT pero con mensajes más específicos
 */
const validateCurrentUser = (req, res, next) => {
  passport.authenticate('current', { session: false }, (err, user, info) => {
    if (err) {
      return sendAuthError(res, 'Error al validar el usuario');
    }
    
    if (!user) {
      return sendAuthError(res, 'Usuario no autenticado');
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Middleware para verificar roles de usuario
 * @param {string|Array} roles - Rol o array de roles permitidos
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, 'Usuario no autenticado');
    }
    
    const userRole = req.user.role;
    const allowedRoles = roles.flat(); // Permite pasar roles como argumentos separados
    
    if (!allowedRoles.includes(userRole)) {
      return sendAuthError(res, 'No tienes permisos para realizar esta acción');
    }
    
    next();
  };
};

/**
 * Middleware para verificar si el usuario es admin
 */
const requireAdmin = authorizeRoles('admin');

/**
 * Middleware para verificar si el usuario es admin o premium
 */
const requireAdminOrPremium = authorizeRoles('admin', 'premium');

/**
 * Middleware para verificar si el usuario puede acceder a su propio recurso
 * @param {string} paramName - Nombre del parámetro que contiene el ID del usuario
 */
const requireOwnershipOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, 'Usuario no autenticado');
    }
    
    const resourceUserId = req.params[paramName];
    const currentUserId = req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (currentUserId !== resourceUserId && !isAdmin) {
      return sendAuthError(res, 'Solo puedes acceder a tus propios recursos');
    }
    
    next();
  };
};

module.exports = {
  authenticateJWT,
  validateCurrentUser,
  authorizeRoles,
  requireAdmin,
  requireAdminOrPremium,
  requireOwnershipOrAdmin
};
