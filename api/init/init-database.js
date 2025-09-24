// API Route para inicializar base de datos - Proxy al backend
export default async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // URL del backend (actualizar cuando cambie)
    const backendUrl = 'https://backend-o7zr8vzuv-partequipos-projects.vercel.app';
    
    // Hacer request al backend
    const response = await fetch(`${backendUrl}/api/init/init-database`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Devolver respuesta exitosa
    res.status(200).json(data);

  } catch (error) {
    console.error('Error en inicialización proxy:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}
