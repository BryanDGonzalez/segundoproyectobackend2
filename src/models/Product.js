const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    trim: true,
    uppercase: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true
  },
  thumbnails: {
    type: [String],
    default: []
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null = producto del sistema, ObjectId = producto de usuario premium/admin
  }
}, {
  timestamps: true
});

// Índices para mejorar búsquedas
productSchema.index({ code: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });

module.exports = mongoose.model('Product', productSchema);


