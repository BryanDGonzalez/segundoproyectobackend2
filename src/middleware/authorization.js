const { sendForbiddenError } = require('../utils/responseUtils');

/**
 * Middleware de autorización por roles
 */

/**
 * Verificar que el usuario tenga un rol específico
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendForbiddenError(res, 'Usuario no autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendForbiddenError(
        res,
        `Acceso denegado. Se requiere uno de los siguientes roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Verificar que el usuario sea admin
 */
const requireAdmin = requireRole('admin');

/**
 * Verificar que el usuario sea admin o premium
 */
const requireAdminOrPremium = requireRole('admin', 'premium');

/**
 * Verificar que el usuario sea el propietario del recurso o admin
 */
const requireOwnerOrAdmin = (resourceUserIdField = 'user') => {
  return (req, res, next) => {
    if (!req.user) {
      return sendForbiddenError(res, 'Usuario no autenticado');
    }

    // Admin puede acceder a todo
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar que el usuario sea el propietario
    const resourceUserId = req.resource?.[resourceUserIdField] || req.params.userId;
    
    if (resourceUserId && resourceUserId.toString() !== req.user._id.toString()) {
      return sendForbiddenError(res, 'No tienes permisos para acceder a este recurso');
    }

    next();
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireAdminOrPremium,
  requireOwnerOrAdmin
};

