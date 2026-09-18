const mongoose = require('mongoose');

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smarthome_energy';

  try {
    // Attempt standard connection to specified MONGO_URI
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if local MongoDB is offline
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Standard MongoDB connection (${primaryUri}) unavailable: ${error.message}`);
    console.log('🔄 Launching embedded In-Memory MongoDB Server for instant development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ Embedded In-Memory MongoDB Started at: ${mongoUri}`);
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB fallback failed: ${memError.message}`);
    }
  }
};

module.exports = connectDB;
