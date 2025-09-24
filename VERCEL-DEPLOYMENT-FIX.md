# Guía de Deployment en Vercel - Solución de Problemas

## Problemas Identificados y Solucionados

### 1. **Error de Conexión Frontend-Backend**
- **Problema**: `Failed to load resource: net::ERR_CONNECTION_REFUSED`
- **Causa**: Variable `VITE_API_URL` no configurada correctamente
- **Solución**: Configurar URL del backend en `vercel.json`

### 2. **Error de CORS**
- **Problema**: Requests bloqueados por CORS
- **Causa**: Dominios del frontend no incluidos en allowedOrigins
- **Solución**: Actualizar configuración CORS en backend

### 3. **Configuración de Rutas en Backend**
- **Problema**: Rutas API no funcionando correctamente
- **Causa**: Configuración incorrecta en `backend/vercel.json`
- **Solución**: Actualizar rutas para incluir `/api/*` y `/health`

## Pasos para Deployment

### Frontend (CompareMachine Frontend)
1. **Variables de Entorno en Vercel Dashboard**:
   ```
   VITE_API_URL = https://compare-machine-backend.vercel.app/api
   ```

2. **Deploy Command**: `npm run build`
3. **Output Directory**: `dist`

### Backend (CompareMachine Backend)
1. **Variables de Entorno en Vercel Dashboard**:
   ```
   DATABASE_URL = [tu-url-de-neon-database]
   JWT_SECRET = [tu-jwt-secret-seguro]
   JWT_EXPIRES_IN = 7d
   NODE_ENV = production
   PORT = 3001
   ```

2. **Deploy Command**: `npm run vercel-build`
3. **Root Directory**: `backend`

## URLs de Deployment Esperadas

- **Frontend**: `https://compare-machine-frontend.vercel.app`
- **Backend**: `https://compare-machine-backend.vercel.app`

## Verificación Post-Deployment

1. **Health Check Backend**: `https://compare-machine-backend.vercel.app/health`
2. **API Login**: `https://compare-machine-backend.vercel.app/api/auth/login`
3. **Frontend**: Verificar que carga sin errores de conexión

## Troubleshooting

### Si persisten errores de conexión:
1. Verificar que las variables de entorno estén configuradas en Vercel Dashboard
2. Verificar que el backend esté desplegado correctamente
3. Verificar logs de Vercel para errores específicos
4. Verificar que la base de datos Neon esté configurada correctamente

### Si hay errores de CORS:
1. Verificar que el dominio del frontend esté en `allowedOrigins`
2. Verificar que `credentials: true` esté configurado
3. Verificar headers de respuesta del backend
