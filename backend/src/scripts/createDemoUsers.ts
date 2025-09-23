import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDemoUsers() {
  try {
    console.log('Creating demo users...');

    // Create admin user
    const adminPassword = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@demo.com' },
      update: {},
      create: {
        name: 'Admin Demo',
        email: 'admin@demo.com',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create regular user
    const userPassword = await bcrypt.hash('password123', 10);
    const regularUser = await prisma.user.upsert({
      where: { email: 'user@demo.com' },
      update: {},
      create: {
        name: 'Usuario Demo',
        email: 'user@demo.com',
        password: userPassword,
        role: 'USER',
      },
    });

    console.log('✅ Demo users created successfully!');
    console.log('📧 Admin: admin@demo.com / password123');
    console.log('📧 User: user@demo.com / password123');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();
