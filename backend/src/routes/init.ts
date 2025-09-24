import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// Endpoint para inicializar la base de datos
router.post('/init-database', async (req, res) => {
  try {
    console.log('🚀 Inicializando base de datos...');
    
    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@comparemachine.com' }
    });

    if (!adminExists) {
      console.log('👤 Creando usuario admin...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await prisma.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@comparemachine.com',
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('✅ Usuario admin creado exitosamente');
    } else {
      console.log('✅ Usuario admin ya existe');
    }

    // Check if demo users exist
    const demoUsersCount = await prisma.user.count({
      where: {
        email: {
          in: ['demo1@comparemachine.com', 'demo2@comparemachine.com']
        }
      }
    });

    if (demoUsersCount < 2) {
      console.log('👥 Creando usuarios demo...');
      
      const demoUsers = [
        {
          name: 'Usuario Demo 1',
          email: 'demo1@comparemachine.com',
          password: await bcrypt.hash('demo123', 12),
          role: 'USER' as const
        },
        {
          name: 'Usuario Demo 2',
          email: 'demo2@comparemachine.com',
          password: await bcrypt.hash('demo123', 12),
          role: 'USER' as const
        }
      ];

      for (const user of demoUsers) {
        const exists = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!exists) {
          await prisma.user.create({ data: user });
          console.log(`✅ Usuario demo creado: ${user.email}`);
        }
      }
    } else {
      console.log('✅ Usuarios demo ya existen');
    }

    res.json({
      success: true,
      message: 'Base de datos inicializada correctamente'
    });
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error inicializando base de datos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;
