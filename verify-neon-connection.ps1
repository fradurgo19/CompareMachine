# 🔍 Script de Verificación de Conexión a Neon Database (PowerShell)
# Ejecutar desde la raíz del proyecto

Write-Host "🔍 Verificando conexión a Neon Database..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "backend/package.json")) {
    Write-Host "❌ Error: Ejecutar este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Cambiar al directorio backend
Set-Location backend

Write-Host "📡 Probando conexión a la base de datos..." -ForegroundColor Yellow
$connectionTest = npx prisma db pull 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Conexión exitosa a Neon Database!" -ForegroundColor Green
} else {
    Write-Host "❌ Error de conexión. Verificar DATABASE_URL" -ForegroundColor Red
    Write-Host $connectionTest -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📊 Estado de las migraciones:" -ForegroundColor Yellow
npx prisma migrate status

Write-Host ""
Write-Host "🗂️ Información de la base de datos:" -ForegroundColor Yellow
npx prisma db execute --stdin <<< "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';"

Write-Host ""
Write-Host "🌐 Para abrir Prisma Studio:" -ForegroundColor Cyan
Write-Host "   npx prisma studio" -ForegroundColor Gray
Write-Host ""
Write-Host "🔧 Para ver el esquema:" -ForegroundColor Cyan
Write-Host "   npx prisma db pull" -ForegroundColor Gray
