/**
 * DTO (Data Transfer Object) para Ticket
 */

class TicketDTO {
  /**
   * DTO para ticket completo
   */
  static toDTO(ticket) {
    if (!ticket) return null;

    return {
      id: ticket._id || ticket.id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      products: ticket.products.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: ticket.createdAt
    };
  }

  /**
   * DTO para ticket con detalles de productos
   */
  static toDetailedDTO(ticket) {
    if (!ticket) return null;

    return {
      id: ticket._id || ticket.id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      products: ticket.products.map(item => ({
        product: {
          id: item.product?._id || item.product?.id,
          title: item.product?.title,
          code: item.product?.code
        },
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })),
      createdAt: ticket.createdAt
    };
  }
}

module.exports = TicketDTO;


