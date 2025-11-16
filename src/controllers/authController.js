const authService = require('../services/authService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/responseUtils');
const passport = require('../config/passport');

/**
 * Controller para Autenticación
 */
class AuthController {
  /**
   * POST /api/sessions/register
   * Registrar nuevo usuario
   */
  async register(req, res) {
    try {
      const { first_name, last_name, email, age, password } = req.body;

      // Validaciones básicas
      if (!first_name || !last_name || !email || !age || !password) {
        return sendValidationError(res, [
          { field: 'general', message: 'Todos los campos son obligatorios' }
        ]);
      }

      const user = await authService.register({
        first_name,
        last_name,
        email,
        age,
        password
      });

      sendSuccess(res, 201, 'Usuario registrado exitosamente', user);
    } catch (error) {
      if (error.message.includes('ya está registrado') || error.message.includes('ya existe')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, 'Error al registrar usuario', error.message);
    }
  }

  /**
   * POST /api/sessions/login
   * Login de usuario
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendValidationError(res, [
          { field: 'general', message: 'Email y contraseña son obligatorios' }
        ]);
      }

      const result = await authService.login(email, password);

      // Opción 1: Enviar token en cookie HTTPOnly
      res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      // Opción 2: También enviar en respuesta JSON
      sendSuccess(res, 200, 'Login exitoso', {
        user: result.user,
        token: result.token
      });
    } catch (error) {
      sendError(res, 401, error.message || 'Error al iniciar sesión');
    }
  }

  /**
   * GET /api/sessions/current
   * Obtener usuario actual autenticado
   */
  async getCurrentUser(req, res) {
    try {
      // El usuario ya viene en req.user gracias al middleware
      if (!req.user) {
        return sendError(res, 401, 'Usuario no autenticado');
      }

      const user = await authService.getCurrentUser(req.user._id.toString());
      sendSuccess(res, 200, 'Usuario actual obtenido', user);
    } catch (error) {
      sendError(res, 500, 'Error al obtener usuario actual', error.message);
    }
  }

  /**
   * POST /api/sessions/logout
   * Logout de usuario
   */
  async logout(req, res) {
    try {
      res.clearCookie('jwt');
      sendSuccess(res, 200, 'Logout exitoso');
    } catch (error) {
      sendError(res, 500, 'Error al cerrar sesión', error.message);
    }
  }

  /**
   * POST /api/sessions/request-password-reset
   * Solicitar recuperación de contraseña
   */
  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return sendValidationError(res, [
          { field: 'email', message: 'El email es obligatorio' }
        ]);
      }

      const result = await authService.requestPasswordReset(email);
      sendSuccess(res, 200, result.message);
    } catch (error) {
      sendError(res, 500, error.message || 'Error al solicitar recuperación de contraseña');
    }
  }

  /**
   * POST /api/sessions/reset-password
   * Resetear contraseña con token
   */
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return sendValidationError(res, [
          { field: 'general', message: 'Token y nueva contraseña son obligatorios' }
        ]);
      }

      const result = await authService.resetPassword(token, newPassword);
      sendSuccess(res, 200, result.message);
    } catch (error) {
      if (error.message.includes('Token inválido') || error.message.includes('expirado')) {
        return sendError(res, 400, error.message);
      }
      if (error.message.includes('diferente')) {
        return sendError(res, 400, error.message);
      }
      sendError(res, 500, error.message || 'Error al restablecer contraseña');
    }
  }
}

module.exports = new AuthController();
