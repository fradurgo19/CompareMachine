# 🗄️ Script de Configuración de Base de Datos Neon para CompareMachine (PowerShell)
# Ejecutar desde la raíz del proyecto

Write-Host "🚀 Iniciando configuración de Base de Datos Neon..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend/package.json")) {
    Write-Host "❌ Error: Ejecutar este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Cambiar al directorio backend
Set-Location backend

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🔧 Generando cliente de Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host "📊 Ejecutando migraciones..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host "🌱 Ejecutando seed con datos iniciales..." -ForegroundColor Yellow
npm run db:seed

Write-Host ""
Write-Host "✅ ¡Base de datos configurada exitosamente!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "👤 Usuario Admin: admin@comparemachine.com / admin123" -ForegroundColor White
Write-Host "👤 Usuario Regular: user@comparemachine.com / user123" -ForegroundColor White
Write-Host "🌐 Prisma Studio: npx prisma studio" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Para verificar la conexión:" -ForegroundColor Yellow
Write-Host "   npx prisma db pull" -ForegroundColor Gray
Write-Host ""
Write-Host "📊 Para ver los datos:" -ForegroundColor Yellow
Write-Host "   npx prisma studio" -ForegroundColor Gray
