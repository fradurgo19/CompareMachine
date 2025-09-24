import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json';

// Import routes
import machineryRoutes from './routes/machinery';
import jointEvaluationRoutes from './routes/jointEvaluation';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import initRoutes from './routes/init';
import debugRoutes from './routes/debug';
import createAdminRoutes from './routes/create-admin';
import updateAdminPasswordRoutes from './routes/update-admin-password';

// Import middleware
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Prisma Client
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/compare_machine_db"
    }
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde.'
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For header for Vercel
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(helmet());

// Configuración de CORS dinámica
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://compare-machine-frontend.vercel.app',
      'https://compare-machine.vercel.app',
      'https://compare-machine-frontend-git-main-frankduran.vercel.app',
      'https://compare-machine-backend.vercel.app',
      'https://compare-machine-backend-git-main-frankduran.vercel.app'
    ]
  : ['http://localhost:5173'];

// Agregar CORS_ORIGIN si está definido
if (process.env.CORS_ORIGIN) {
  allowedOrigins.push(process.env.CORS_ORIGIN);
}

app.use(cors({
  origin: true, // Permitir todos los orígenes temporalmente
  credentials: true
}));
app.use(morgan('combined'));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger Documentation
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API de CompareMachine está funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/joint-evaluations', jointEvaluationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/init', initRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/create-admin', createAdminRoutes);
app.use('/api/update-admin', updateAdminPasswordRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

export default app;
