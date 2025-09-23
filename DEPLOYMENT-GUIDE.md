# 🚀 Guía de Despliegue en Vercel - CompareMachine

## 📋 Checklist Pre-Despliegue

### ✅ Archivos Creados/Modificados
- [x] `vercel.json` (configuración frontend)
- [x] `backend/vercel.json` (configuración backend)
- [x] `env.production` (variables frontend)
- [x] `backend/env.production` (variables backend)
- [x] `src/config/environment.ts` (configuración dinámica)
- [x] `src/services/api.ts` (actualizado para producción)
- [x] `backend/src/index.ts` (CORS dinámico)
- [x] `package.json` (scripts de build)
- [x] `vite.config.ts` (optimizado para producción)

## 🗄️ Configuración de Base de Datos Neon

### 1. Crear proyecto en Neon
1. Ir a [neon.tech](https://neon.tech)
2. Crear nuevo proyecto
3. Copiar la URL de conexión

### 2. Configurar variables de entorno en Vercel
```bash
# Variables para el Backend
DATABASE_URL=postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/compare_machine_db?sslmode=require
JWT_SECRET=tu-jwt-secret-super-seguro-para-produccion-2024
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://tu-frontend-url.vercel.app

# Variables para el Frontend
VITE_API_URL=https://tu-backend-url.vercel.app/api
```

## 🚀 Pasos de Despliegue

### FASE 1: Desplegar Backend
1. **Conectar repositorio a Vercel**
   ```bash
   # En la carpeta backend
   vercel --prod
   ```

2. **Configurar variables de entorno en Vercel Dashboard**
   - Ir a Project Settings > Environment Variables
   - Agregar todas las variables del backend

3. **Ejecutar migraciones de Prisma**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### FASE 2: Desplegar Frontend
1. **Conectar repositorio a Vercel**
   ```bash
   # En la raíz del proyecto
   vercel --prod
   ```

2. **Configurar variables de entorno**
   - Agregar `VITE_API_URL` con la URL del backend

3. **Configurar Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
# Frontend
npm run dev

# Backend
cd backend
npm run dev
```

### Build Local
```bash
# Frontend
npm run build
npm run preview

# Backend
cd backend
npm run build
npm start
```

### Testing de Producción Local
```bash
# Frontend con variables de producción
npm run preview:production
```

## 🌐 URLs de Ejemplo

### Desarrollo
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Producción
- Frontend: `https://compare-machine-frontend.vercel.app`
- Backend: `https://compare-machine-backend.vercel.app`

## ⚠️ Notas Importantes

1. **Actualizar URLs**: Cambiar las URLs de ejemplo por las reales de tu proyecto
2. **JWT Secret**: Usar un secret fuerte y único para producción
3. **CORS**: Actualizar los orígenes permitidos con tus URLs reales
4. **Base de Datos**: Asegurar que Neon esté configurado correctamente
5. **SSL**: Vercel maneja SSL automáticamente

## 🐛 Troubleshooting

### Error de CORS
- Verificar que `CORS_ORIGIN` coincida con la URL del frontend
- Revisar configuración en `backend/src/index.ts`

### Error de Base de Datos
- Verificar `DATABASE_URL` en Neon
- Ejecutar migraciones: `npx prisma migrate deploy`

### Error de Build
- Verificar que todas las dependencias estén instaladas
- Revisar logs de build en Vercel Dashboard

## 📞 Soporte
Si encuentras problemas, revisar:
1. Logs de Vercel Dashboard
2. Console del navegador
3. Network tab para errores de API
4. Variables de entorno en Vercel
