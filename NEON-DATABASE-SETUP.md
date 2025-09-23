# 🗄️ Script Completo para Base de Datos Neon - CompareMachine

## 📋 Pasos para Configurar Neon

### 1. **Crear Proyecto en Neon**
1. Ir a [neon.tech](https://neon.tech)
2. Registrarse/Iniciar sesión
3. Crear nuevo proyecto: `compare-machine-db`
4. Seleccionar región más cercana (us-east-1 para mejor rendimiento)
5. Copiar la **Connection String**

### 2. **Configurar Variables de Entorno**

#### En Vercel Dashboard (Backend):
```bash
DATABASE_URL=postgresql://usuario:password@ep-xxxxx.us-east-1.aws.neon.tech/compare_machine_db?sslmode=require
JWT_SECRET=compare-machine-super-secret-jwt-key-production-2024
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://tu-frontend-url.vercel.app
```

#### En Vercel Dashboard (Frontend):
```bash
VITE_API_URL=https://tu-backend-url.vercel.app/api
```

## 🚀 Scripts de Configuración

### **Script 1: Configuración Inicial de Neon**
```bash
#!/bin/bash
# Script para configurar Neon Database

echo "🗄️ Configurando Base de Datos Neon para CompareMachine..."

# 1. Instalar dependencias si no están instaladas
echo "📦 Instalando dependencias..."
cd backend
npm install

# 2. Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npx prisma generate

# 3. Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
npx prisma migrate deploy

# 4. Ejecutar seed (datos iniciales)
echo "🌱 Ejecutando seed con datos iniciales..."
npm run db:seed

echo "✅ Base de datos configurada exitosamente!"
echo "👤 Usuario Admin: admin@comparemachine.com / admin123"
echo "👤 Usuario Regular: user@comparemachine.com / user123"
```

### **Script 2: Verificación de Conexión**
```bash
#!/bin/bash
# Script para verificar conexión a Neon

echo "🔍 Verificando conexión a Neon Database..."

cd backend

# Verificar conexión
echo "📡 Probando conexión..."
npx prisma db pull

# Mostrar estado de la base de datos
echo "📊 Estado de las tablas:"
npx prisma studio --port 5555 &

echo "✅ Verificación completada!"
echo "🌐 Prisma Studio disponible en: http://localhost:5555"
```

### **Script 3: Reset y Reconfiguración**
```bash
#!/bin/bash
# Script para resetear y reconfigurar la base de datos

echo "🔄 Reseteando Base de Datos Neon..."

cd backend

# Resetear base de datos
echo "🗑️ Reseteando base de datos..."
npx prisma migrate reset --force

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
npx prisma migrate deploy

# Ejecutar seed
echo "🌱 Ejecutando seed..."
npm run db:seed

echo "✅ Base de datos reseteada y reconfigurada!"
```

## 📊 Estructura de la Base de Datos

### **Tablas Creadas:**
1. **users** - Usuarios del sistema
2. **machinery** - Maquinaria pesada
3. **machinery_specifications** - Especificaciones técnicas
4. **joint_evaluations** - Evaluaciones de juntas

### **Datos Iniciales Incluidos:**
- ✅ 2 usuarios (Admin y Regular)
- ✅ 4 máquinas de ejemplo (Caterpillar, John Deere, Komatsu, Volvo)
- ✅ Especificaciones técnicas completas
- ✅ 2 evaluaciones de juntas de ejemplo

## 🔧 Comandos Útiles

### **Desarrollo Local:**
```bash
# Conectar a Neon desde local
cd backend
npx prisma studio

# Ver estado de migraciones
npx prisma migrate status

# Generar nueva migración
npx prisma migrate dev --name nombre_migracion
```

### **Producción:**
```bash
# Desplegar migraciones en producción
npx prisma migrate deploy

# Generar cliente para producción
npx prisma generate
```

## 🚨 Troubleshooting

### **Error de Conexión:**
```bash
# Verificar URL de conexión
echo $DATABASE_URL

# Probar conexión
npx prisma db pull
```

### **Error de Migraciones:**
```bash
# Resetear migraciones
npx prisma migrate reset --force

# Re-ejecutar migraciones
npx prisma migrate deploy
```

### **Error de Seed:**
```bash
# Ejecutar seed manualmente
npx prisma db seed
```

## 📝 Notas Importantes

1. **SSL Requerido**: Neon requiere SSL, usar `?sslmode=require`
2. **Pool de Conexiones**: Neon maneja automáticamente el pooling
3. **Backups**: Neon hace backups automáticos cada 24 horas
4. **Escalabilidad**: Neon escala automáticamente según demanda

## 🔐 Seguridad

- ✅ Conexión SSL obligatoria
- ✅ Variables de entorno seguras
- ✅ JWT con secret fuerte
- ✅ CORS configurado correctamente
- ✅ Rate limiting implementado

## 📞 Soporte

Si encuentras problemas:
1. Verificar logs en Neon Dashboard
2. Revisar variables de entorno en Vercel
3. Probar conexión con Prisma Studio
4. Verificar migraciones con `npx prisma migrate status`
