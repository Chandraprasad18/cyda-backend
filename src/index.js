import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 5000;

// --- MONGODB DATABASE CONNECTION & SERVER START ---
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
})
.then(() => {
  console.log('✅ Connected to MongoDB Database Successfully!');
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
});