// server.js - UPDATED

require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');

const config = require('./src/config/config');
const { connectDB } = require('./src/config/db');
const { applySecurity, authRateLimit } = require('./src/middlewares/security');
const { globalErrorHandler, notFoundHandler } = require('./src/middlewares/errorHandler');
const { sanitizeInput } = require('./src/middlewares/validation');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const groupRoutes = require('./src/routes/groupRoutes');

const walletRoutes = require('./src/routes/walletRoutes');
const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); 
  }
};

const createApp = () => {
  const app = express();
  
  console.log('Initializing server...');
  
  applySecurity(app);
  
  app.use(express.json({ 
    limit: '10mb',
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({
          success: false,
          message: 'Invalid JSON format',
          error: 'INVALID_JSON'
        });
        throw new Error('Invalid JSON');
      }
    }
  }));
  
  app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
  }));
  
  app.use(cookieParser());
  app.use(sanitizeInput);
  
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is running!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: config.server.nodeEnv
    });
  });
  
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'API is healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });
  
  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/groups', groupRoutes); // NEW
  app.use('/api/wallets', walletRoutes);
  app.use(notFoundHandler);
  app.use(globalErrorHandler);
  
  return app;
};

const startServer = async () => {
  try {
    await initializeDatabase();
    const app = createApp();
    
    const server = app.listen(config.server.port, () => {
      console.log('\n🎉 Server started successfully!');
      console.log(`🔌 Server running on port ${config.server.port}`);
      console.log(`🌍 Environment: ${config.server.nodeEnv}`);
      console.log(`🔗 Local URL: http://localhost:${config.server.port}`);
      console.log(`💾 Database: Connected to MongoDB Atlas`);
      console.log(`🔒 Security: All security middleware active`);
      console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
    });
    
    const gracefulShutdown = (signal) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close((err) => {
        if (err) {
          console.error('❌ Error during server shutdown:', err);
          process.exit(1);
        }
        
        console.log('✅ Server closed successfully');
        console.log('👋 Goodbye!');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      process.exit(1);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();