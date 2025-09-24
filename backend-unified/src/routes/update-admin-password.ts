import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { ApiResponse } from '../types';

const router = Router();

// Endpoint para actualizar la contraseña del usuario admin
router.post('/update-admin-password', async (req, res) => {
  try {
    // Buscar el usuario admin
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@comparemachine.com' }
    });

    if (!adminUser) {
      res.status(404).json({
        success: false,
        message: 'Usuario admin no encontrado'
      });
      return;
    }

    // Actualizar la contraseña a admin123
    const newPassword = await bcrypt.hash('admin123', 12);
    
    await prisma.user.update({
      where: { id: adminUser.id },
      data: { password: newPassword }
    });

    const response: ApiResponse<any> = {
      success: true,
      message: 'Contraseña del usuario admin actualizada exitosamente a admin123',
      data: {
        email: 'admin@comparemachine.com',
        password: 'admin123'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error al actualizar contraseña del admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar contraseña del admin',
      error: (error as Error).message,
    });
  }
});

export default router;
