#!/bin/bash

# 🔍 Script de Verificación de Conexión a Neon Database
# Ejecutar desde la raíz del proyecto

echo "🔍 Verificando conexión a Neon Database..."
echo "=========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Cambiar al directorio backend
cd backend

echo "📡 Probando conexión a la base de datos..."
npx prisma db pull

if [ $? -eq 0 ]; then
    echo "✅ Conexión exitosa a Neon Database!"
else
    echo "❌ Error de conexión. Verificar DATABASE_URL"
    exit 1
fi

echo ""
echo "📊 Estado de las migraciones:"
npx prisma migrate status

echo ""
echo "🗂️ Tablas en la base de datos:"
npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

echo ""
echo "🌐 Para abrir Prisma Studio:"
echo "   npx prisma studio"
echo ""
echo "🔧 Para ver el esquema:"
echo "   npx prisma db pull"
