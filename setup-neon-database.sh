#!/bin/bash

# 🗄️ Script de Configuración de Base de Datos Neon para CompareMachine
# Ejecutar desde la raíz del proyecto

echo "🚀 Iniciando configuración de Base de Datos Neon..."
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Cambiar al directorio backend
cd backend

echo "📦 Instalando dependencias..."
npm install

echo "🔧 Generando cliente de Prisma..."
npx prisma generate

echo "📊 Ejecutando migraciones..."
npx prisma migrate deploy

echo "🌱 Ejecutando seed con datos iniciales..."
npm run db:seed

echo ""
echo "✅ ¡Base de datos configurada exitosamente!"
echo "=================================================="
echo "👤 Usuario Admin: admin@comparemachine.com / admin123"
echo "👤 Usuario Regular: user@comparemachine.com / user123"
echo "🌐 Prisma Studio: npx prisma studio"
echo ""
echo "🔍 Para verificar la conexión:"
echo "   npx prisma db pull"
echo ""
echo "📊 Para ver los datos:"
echo "   npx prisma studio"
