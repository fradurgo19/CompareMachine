# 🚀 Guía Completa de Despliegue en Vercel - CompareMachine

## 📋 Checklist Pre-Despliegue

### ✅ Requisitos Previos
- [x] Base de datos configurada en Neon
- [x] Connection String de Neon copiado
- [x] Archivos de configuración creados (vercel.json)
- [x] Variables de entorno preparadas

## 🔧 PASO 1: Instalar Vercel CLI

### Windows (PowerShell como Administrador):
```powershell
npm install -g vercel
```

### Verificar instalación:
```powershell
vercel --version
```

## 🔐 PASO 2: Autenticarse en Vercel

```powershell
vercel login
```

**Opciones de login:**
1. **Email**: Ingresar email y recibir código por email
2. **GitHub**: Conectar con cuenta de GitHub
3. **GitLab**: Conectar con cuenta de GitLab

## 🗄️ PASO 3: Desplegar Backend

### 3.1 Navegar al directorio backend:
```powershell
cd backend
```

### 3.2 Inicializar proyecto en Vercel:
```powershell
vercel
```

**Configuración del Backend:**
- **Project Name**: `compare-machine-backend`
- **Directory**: `./backend`
- **Framework**: `Other`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Desplegar a producción:
```powershell
vercel --prod
```

## 🌐 PASO 4: Desplegar Frontend

### 4.1 Volver al directorio raíz:
```powershell
cd ..
```

### 4.2 Inicializar proyecto frontend:
```powershell
vercel
```

**Configuración del Frontend:**
- **Project Name**: `compare-machine-frontend`
- **Directory**: `./`
- **Framework**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4.3 Desplegar a producción:
```powershell
vercel --prod
```

## ⚙️ PASO 5: Configurar Variables de Entorno

### 5.1 Variables del Backend:
Ir a Vercel Dashboard → Backend Project → Settings → Environment Variables

```bash
# Variables de Producción
DATABASE_URL=postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/compare_machine_db?sslmode=require
JWT_SECRET=compare-machine-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://compare-machine-frontend.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 5.2 Variables del Frontend:
Ir a Vercel Dashboard → Frontend Project → Settings → Environment Variables

```bash
# Variables de Producción
VITE_API_URL=https://compare-machine-backend.vercel.app/api
VITE_ENVIRONMENT=production
```

## 🔄 PASO 6: Re-desplegar con Variables

### 6.1 Re-desplegar Backend:
```powershell
cd backend
vercel --prod
```

### 6.2 Re-desplegar Frontend:
```powershell
cd ..
vercel --prod
```

## 🧪 PASO 7: Probar Despliegue

### 7.1 URLs de Producción:
- **Backend**: `https://compare-machine-backend.vercel.app`
- **Frontend**: `https://compare-machine-frontend.vercel.app`

### 7.2 Endpoints de Prueba:
```bash
# Health Check del Backend
curl https://compare-machine-backend.vercel.app/health

# API de Maquinaria
curl https://compare-machine-backend.vercel.app/api/machinery
```

## 🔧 PASO 8: Configurar Dominios Personalizados (Opcional)

### 8.1 En Vercel Dashboard:
1. Ir a Project Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

### 8.2 Ejemplo de Dominios:
- **Backend**: `api.comparemachine.com`
- **Frontend**: `comparemachine.com`

## 📊 PASO 9: Monitoreo y Logs

### 9.1 Ver Logs en Tiempo Real:
```powershell
vercel logs
```

### 9.2 Ver Logs de Proyecto Específico:
```powershell
vercel logs --project=compare-machine-backend
vercel logs --project=compare-machine-frontend
```

## 🚨 Troubleshooting

### Error de Build:
```powershell
# Ver logs detallados
vercel logs --project=nombre-proyecto

# Re-desplegar con debug
vercel --prod --debug
```

### Error de Variables de Entorno:
1. Verificar en Vercel Dashboard
2. Re-desplegar después de cambios
3. Verificar sintaxis de variables

### Error de CORS:
1. Verificar CORS_ORIGIN en backend
2. Actualizar con URL correcta del frontend
3. Re-desplegar backend

## ✅ Checklist Final

- [ ] Backend desplegado en Vercel
- [ ] Frontend desplegado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Health check funcionando
- [ ] API respondiendo correctamente
- [ ] Frontend conectando con backend
- [ ] Dominios personalizados (opcional)
- [ ] Logs monitoreados

## 🎯 URLs Finales

### Desarrollo:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

### Producción:
- Frontend: `https://compare-machine-frontend.vercel.app`
- Backend: `https://compare-machine-backend.vercel.app`

## 📞 Siguiente Paso

Una vez completado el despliegue:
1. ✅ Probar todas las funcionalidades
2. ✅ Configurar monitoreo
3. ✅ Configurar backups
4. ✅ Documentar URLs de producción
