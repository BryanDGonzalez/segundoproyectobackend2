const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1'],
    default: 1
  }
}, {
  _id: true
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  products: {
    type: [cartItemSchema],
    default: []
  }
}, {
  timestamps: true
});

// Método para calcular el total del carrito
cartSchema.methods.calculateTotal = async function() {
  await this.populate('products.product');
  let total = 0;
  
  for (const item of this.products) {
    if (item.product && item.product.price) {
      total += item.product.price * item.quantity;
    }
  }
  
  return total;
};

// Método para obtener productos con detalles
cartSchema.methods.getProductsWithDetails = async function() {
  await this.populate('products.product');
  return this.products.map(item => ({
    product: item.product,
    quantity: item.quantity,
    subtotal: item.product ? item.product.price * item.quantity : 0
  }));
};

module.exports = mongoose.model('Cart', cartSchema);


