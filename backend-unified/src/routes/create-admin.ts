import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { ApiResponse } from '../types';
import { UserRole } from '@prisma/client';

const router = Router();

// Endpoint para crear usuario admin con contraseña conocida
router.post('/create-admin', async (req, res) => {
  try {
    // Eliminar usuario admin existente si existe
    await prisma.user.deleteMany({
      where: { email: 'admin@comparemachine.com' }
    });

    // Crear usuario admin con contraseña admin123
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@comparemachine.com',
        password: adminPassword,
        role: UserRole.ADMIN,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const response: ApiResponse<any> = {
      success: true,
      message: 'Usuario admin creado exitosamente con contraseña admin123',
      data: {
        user: adminUser,
        password: 'admin123'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al crear usuario admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear usuario admin',
      error: (error as Error).message,
    });
  }
});

export default router;
