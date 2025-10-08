import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client as a singleton
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/compare_machine_db"
    }
  }
});

// Log Prisma Client initialization
console.log('🔧 Prisma Client Initialized');
console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
console.log('📋 MachineryDimension model available:', typeof prisma.machineryDimension !== 'undefined');

