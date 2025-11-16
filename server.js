const app = require('./src/app');
const connectDB = require('./src/config/database');

// Configurar variables de entorno
const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado exitosamente');
      console.log(`📍 Puerto: ${PORT}`);
      console.log(`🌍 Entorno: ${NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log('📚 Endpoints disponibles:');
      console.log('   - GET  /api/health');
      console.log('   - POST /api/sessions/register');
      console.log('   - POST /api/sessions/login');
      console.log('   - GET  /api/sessions/current');
      console.log('   - POST /api/users');
      console.log('   - GET  /api/users');
      console.log('   - GET  /api/users/:id');
      console.log('   - PUT  /api/users/:id');
      console.log('   - DELETE /api/users/:id');
    });
    
    // Manejo de errores del servidor
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
      } else {
        console.error('❌ Error del servidor:', error);
      }
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales del sistema
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Iniciar el servidor
startServer();
