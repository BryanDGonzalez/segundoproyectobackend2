const mongoose = require('mongoose');

/**
 * Conecta a la base de datos MongoDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    
    // Eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB desconectado');
    });
    
    // Manejo de cierre graceful
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 Conexión a MongoDB cerrada');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
