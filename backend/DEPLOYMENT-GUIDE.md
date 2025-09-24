# Guía de Deployment del Backend en Vercel

## Pasos para Desplegar el Backend

### 1. **Crear Proyecto Separado en Vercel**

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. **IMPORTANTE**: Selecciona la carpeta `backend` como Root Directory

### 2. **Configuración del Proyecto**

- **Framework Preset**: Other
- **Root Directory**: `backend`
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. **Variables de Entorno**

Configura estas variables en Vercel Dashboard:

```
DATABASE_URL=postgresql://neondb_owner:npg_tBuUo8nIk7wQ@ep-frosty-lake-adkax84c-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=340266ceb7d651dedea8a59515aa0711de68e8e1124cdf582a4f3bdb7d2366693172a5ed88f39c9e84b2bcf662d772cfc1ea56188962951457c05f93ec1b3fc3
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://compare-machine.vercel.app
```

### 4. **Verificación Post-Deployment**

Una vez desplegado, verifica:

1. **Health Check**: `https://tu-backend-url.vercel.app/health`
2. **API Login**: `https://tu-backend-url.vercel.app/api/auth/login`

### 5. **Actualizar Frontend**

Una vez que tengas la URL del backend, actualiza:

- **Frontend Vercel Variables**: `VITE_API_URL=https://tu-backend-url.vercel.app/api`

## Problemas Comunes

### Error: "Cannot find module"
- Verificar que `prisma generate` se ejecute en el build
- Verificar que todas las dependencias estén en `package.json`

### Error: "Database connection failed"
- Verificar que `DATABASE_URL` esté configurada correctamente
- Verificar que la base de datos Neon esté activa

### Error: "CORS policy"
- Verificar que `CORS_ORIGIN` incluya el dominio del frontend
- Verificar que el frontend esté en la lista de `allowedOrigins`
