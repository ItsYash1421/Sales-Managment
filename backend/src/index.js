import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import salesRoutes from './routes/salesRoutes.js';
import { connectDB } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// CORS configuration for production and development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://truestate-frontend.onrender.com',
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : '*',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());


app.use('/api/sales', salesRoutes);


app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Sales Management API',
    status: 'running',
    version: '1.0.0'
  });
});


(async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully!');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
