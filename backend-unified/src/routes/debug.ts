import { Router } from 'express';
import { prisma } from '../index';
import { ApiResponse } from '../types';

const router = Router();

// Endpoint para verificar la conexión a la base de datos
router.get('/db-connection', async (req, res) => {
  try {
    // Intentar hacer una consulta simple
    const userCount = await prisma.user.count();
    
    const response: ApiResponse<any> = {
      success: true,
      message: 'Conexión a la base de datos exitosa',
      data: {
        userCount,
        databaseUrl: process.env.DATABASE_URL ? 'Configurada' : 'No configurada',
        jwtSecret: process.env.JWT_SECRET ? 'Configurado' : 'No configurado'
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: (error as Error).message
    });
  }
});

// Endpoint para listar usuarios (solo para debug)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    const response: ApiResponse<any> = {
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: { users }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo usuarios',
      error: (error as Error).message
    });
  }
});

export default router;
