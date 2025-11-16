/**
 * Envía una respuesta de éxito
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje de éxito
 * @param {*} data - Datos a enviar
 */
const sendSuccess = (res, statusCode = 200, message, data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  
  res.status(statusCode).json(response);
};

/**
 * Envía una respuesta de error
 * @param {Object} res - Objeto response de Express
 * @param {number} statusCode - Código de estado HTTP
 * @param {string} message - Mensaje de error
 * @param {*} errors - Detalles del error (opcional)
 */
const sendError = (res, statusCode = 500, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  
  res.status(statusCode).json(response);
};

/**
 * Envía una respuesta de error de validación
 * @param {Object} res - Objeto response de Express
 * @param {Array} errors - Array de errores de validación
 */
const sendValidationError = (res, errors) => {
  const response = {
    success: false,
    message: 'Ups! Hay algunos problemas con los datos que enviaste',
    errors
  };
  
  res.status(400).json(response);
};

/**
 * Envía una respuesta de error de autenticación
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de error
 */
const sendAuthError = (res, message = 'No tienes permisos para hacer esto') => {
  const response = {
    success: false,
    message
  };
  
  res.status(401).json(response);
};

/**
 * Envía una respuesta de error de autorización
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de error
 */
const sendForbiddenError = (res, message = 'No tienes permisos para acceder a esto') => {
  const response = {
    success: false,
    message
  };
  
  res.status(403).json(response);
};

/**
 * Envía una respuesta de error de recurso no encontrado
 * @param {Object} res - Objeto response de Express
 * @param {string} message - Mensaje de error
 */
const sendNotFoundError = (res, message = 'No encontramos lo que buscas') => {
  const response = {
    success: false,
    message
  };
  
  res.status(404).json(response);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendAuthError,
  sendForbiddenError,
  sendNotFoundError
};
