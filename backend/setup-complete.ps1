# Script completo para configurar CompareMachine Backend
Write-Host "🚀 Configurando CompareMachine Backend..." -ForegroundColor Green

# Verificar si Node.js está instalado
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Por favor instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Verificar si PostgreSQL está instalado
Write-Host "Verificando PostgreSQL..." -ForegroundColor Yellow
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (Test-Path $psqlPath) {
    Write-Host "✅ PostgreSQL encontrado en: $psqlPath" -ForegroundColor Green
} else {
    Write-Host "❌ PostgreSQL no encontrado. Por favor instala PostgreSQL 17." -ForegroundColor Red
    Write-Host "Descarga desde: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    exit 1
}

# Instalar dependencias
Write-Host "Instalando dependencias..." -ForegroundColor Yellow
npm install

# Generar cliente Prisma
Write-Host "Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# Verificar conexión a la base de datos
Write-Host "Verificando conexión a la base de datos..." -ForegroundColor Yellow
Write-Host "Por favor, asegúrate de que:" -ForegroundColor Cyan
Write-Host "1. PostgreSQL esté ejecutándose" -ForegroundColor Cyan
Write-Host "2. La contraseña del usuario 'postgres' esté configurada" -ForegroundColor Cyan
Write-Host "3. La base de datos 'compare_machine_db' esté creada" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para crear la base de datos, ejecuta en pgAdmin o psql:" -ForegroundColor Yellow
Write-Host "CREATE DATABASE compare_machine_db;" -ForegroundColor White
Write-Host ""

# Preguntar si quiere continuar
$continue = Read-Host "¿Has configurado la base de datos? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "Por favor configura la base de datos y ejecuta este script nuevamente." -ForegroundColor Yellow
    exit 0
}

# Intentar ejecutar migraciones
Write-Host "Ejecutando migraciones de Prisma..." -ForegroundColor Yellow
try {
    npx prisma db push
    Write-Host "✅ Migraciones ejecutadas exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al ejecutar migraciones. Verifica la configuración de la base de datos." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Ejecutar seed
Write-Host "Poblando base de datos con datos de ejemplo..." -ForegroundColor Yellow
try {
    npx ts-node prisma/seed.ts
    Write-Host "✅ Base de datos poblada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Error al poblar la base de datos. Continuando sin datos de ejemplo." -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host "Iniciando servidor backend..." -ForegroundColor Yellow
Write-Host "El servidor estará disponible en: http://localhost:3001" -ForegroundColor Green
Write-Host "Health check: http://localhost:3001/health" -ForegroundColor Green
Write-Host "API Documentation: http://localhost:3001/api-docs" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow

npm run dev
