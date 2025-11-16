/**
 * DTO (Data Transfer Object) para User
 * Define qué campos se pueden enviar al cliente
 * Evita enviar información sensible
 */

class UserDTO {
  /**
   * DTO para datos públicos del usuario (usado en /current)
   */
  static toPublicDTO(user) {
    if (!user) return null;

    return {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * DTO para lista de usuarios (sin información sensible)
   */
  static toListDTO(user) {
    if (!user) return null;

    return {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    };
  }

  /**
   * DTO para respuesta de creación/actualización
   */
  static toResponseDTO(user) {
    if (!user) return null;

    return {
      id: user._id || user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role,
      cart: user.cart
    };
  }
}

module.exports = UserDTO;


