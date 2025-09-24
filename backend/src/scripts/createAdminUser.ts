import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './config.env' });

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔍 Verificando si el usuario admin ya existe...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@comparemachine.com' }
    });

    if (existingAdmin) {
      console.log('✅ Usuario admin ya existe:', existingAdmin.email);
      return;
    }

    console.log('👤 Creando usuario admin...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@comparemachine.com',
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('✅ Usuario admin creado exitosamente:');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Nombre:', adminUser.name);
    console.log('🔑 Rol:', adminUser.role);
    console.log('🆔 ID:', adminUser.id);
    console.log('📅 Creado:', adminUser.createdAt);
    
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('🎉 Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script falló:', error);
    process.exit(1);
  });
