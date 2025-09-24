# Guía de Migración a Configuración Unificada

## Estructura del Proyecto Unificado

```
compare-machine-unified/
├── frontend/                 # Frontend React + Vite
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend-unified/          # Backend Node.js + Express
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── vercel.json
├── vercel-unified.json       # Configuración unificada
├── package-unified.json      # Scripts unificados
└── MIGRATION-GUIDE.md
```

## Pasos para Deployment

### 1. Crear Nuevo Proyecto en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en **"New Project"**
3. Conecta tu repositorio de GitHub
4. **IMPORTANTE**: Selecciona la carpeta raíz del proyecto

### 2. Configurar Variables de Entorno

En Vercel Dashboard, configura estas variables:

```
# Backend
DATABASE_URL=postgresql://neondb_owner:npg_tBuUo8nIk7wQ@ep-frosty-lake-adkax84c-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=340266ceb7d651dedea8a59515aa0711de68e8e1124cdf582a4f3bdb7d2366693172a5ed88f39c9e84b2bcf662d772cfc1ea56188962951457c05f93ec1b3fc3
JWT_EXPIRES_IN=7d
NODE_ENV=production
CORS_ORIGIN=https://tu-nuevo-proyecto.vercel.app

# Frontend
VITE_API_URL=/api
VITE_APP_NAME=CompareMachine
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

### 3. Configurar Build Settings

- **Framework Preset**: Other
- **Root Directory**: `/` (raíz del proyecto)
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`

### 4. Renombrar Archivos

1. Renombra `vercel-unified.json` a `vercel.json`
2. Renombra `package-unified.json` a `package.json`

### 5. Hacer Deploy

1. Haz commit y push de todos los cambios
2. Vercel automáticamente detectará la nueva configuración
3. El deployment incluirá tanto frontend como backend

## Ventajas de esta Configuración

✅ **Sin CORS**: Frontend y backend en el mismo dominio
✅ **URLs Estables**: No cambian con cada redeploy
✅ **Deployment Unificado**: Un solo comando para ambos
✅ **Configuración Simplificada**: Una sola configuración
✅ **Mejor Performance**: Sin requests externos

## Verificación Post-Deployment

1. **Frontend**: `https://tu-proyecto.vercel.app`
2. **Backend Health**: `https://tu-proyecto.vercel.app/health`
3. **API Login**: `https://tu-proyecto.vercel.app/api/auth/login`
4. **Inicialización**: `https://tu-proyecto.vercel.app/api/init/init-database`

## Troubleshooting

### Si el build falla:
- Verificar que todas las dependencias estén instaladas
- Verificar que los paths en vercel.json sean correctos
- Verificar que las variables de entorno estén configuradas

### Si las rutas no funcionan:
- Verificar el orden de las rutas en vercel.json
- Verificar que el backend esté configurado correctamente
- Verificar los logs de deployment en Vercel
