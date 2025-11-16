const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
    min: [0, 'El monto no puede ser negativo']
  },
  purchaser: {
    type: String,
    required: [true, 'El email del comprador es obligatorio'],
    lowercase: true,
    trim: true
  },
  products: {
    type: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    default: []
  }
}, {
  timestamps: true
});

// Índice para búsquedas por comprador
ticketSchema.index({ purchaser: 1 });
ticketSchema.index({ code: 1 });

// Método estático para generar código único
ticketSchema.statics.generateCode = function() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${timestamp}-${random}`;
};

module.exports = mongoose.model('Ticket', ticketSchema);


