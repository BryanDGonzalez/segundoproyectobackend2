const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    minlength: [2, 'El nombre debe tener al menos 2 caracteres']
  },
  last_name: {
    type: String,
    required: [true, 'El apellido es obligatorio'],
    trim: true,
    minlength: [2, 'El apellido debe tener al menos 2 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  age: {
    type: Number,
    required: [true, 'La edad es obligatoria'],
    min: [0, 'La edad no puede ser negativa'],
    max: [120, 'La edad no puede ser mayor a 120 años']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  },
  lastPasswordChange: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', function(next) {
  // Solo encriptar si la contraseña ha sido modificada
  if (!this.isModified('password')) return next();
  
  try {
    // Encriptar la contraseña con bcrypt.hashSync (como se requiere)
    const saltRounds = 10;
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas usando bcrypt.compareSync
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compareSync(candidatePassword, this.password);
};

// Método para obtener datos del usuario sin la contraseña
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
