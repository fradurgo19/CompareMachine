# 🚀 Script para desplegar Backend en Vercel
# Ejecutar desde el directorio backend

Write-Host "🚀 Desplegando Backend en Vercel..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio backend
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecutar este script desde el directorio backend" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "🔧 Generando cliente de Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host "📊 Ejecutando migraciones..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host "🏗️ Construyendo proyecto..." -ForegroundColor Yellow
npm run build

Write-Host "🚀 Desplegando en Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host ""
Write-Host "✅ ¡Backend desplegado exitosamente!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🌐 URL del Backend: https://compare-machine-backend.vercel.app" -ForegroundColor White
Write-Host "🏥 Health Check: https://compare-machine-backend.vercel.app/health" -ForegroundColor White
Write-Host ""
Write-Host "📝 Siguiente paso: Configurar variables de entorno en Vercel Dashboard" -ForegroundColor Yellow
