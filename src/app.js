const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: './config.env' });

// Importar configuración de Passport
require('./config/passport');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

const app = express();

// Middleware global
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/carts', purchaseRoutes); // Purchase routes también usan /api/carts

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Ecommerce - Sistema de Autenticación',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      sessions: '/api/sessions',
      health: '/api/health'
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;
