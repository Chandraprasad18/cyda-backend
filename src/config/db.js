const mongoose = require('mongoose');
 
/**
 * Initializes a connection to MongoDB using the configured URI string.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
 
    console.log(`🚀 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Failure: ${error.message}`);
    // Shut down the application immediately if the database isn't reachable
    process.exit(1);
  }
};
 
module.exports = connectDB;
 