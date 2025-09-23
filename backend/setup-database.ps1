# Script para configurar la base de datos PostgreSQL
Write-Host "Configurando base de datos PostgreSQL..." -ForegroundColor Green

# Ruta a PostgreSQL
$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

# Verificar si PostgreSQL está instalado
if (Test-Path $psqlPath) {
    Write-Host "PostgreSQL encontrado en: $psqlPath" -ForegroundColor Green
    
    # Intentar conectarse y crear la base de datos
    try {
        Write-Host "Creando base de datos..." -ForegroundColor Yellow
        & $psqlPath -U postgres -h localhost -f setup-db.sql
        Write-Host "Base de datos creada exitosamente!" -ForegroundColor Green
    }
    catch {
        Write-Host "Error al crear la base de datos: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "Asegúrate de que PostgreSQL esté ejecutándose y que la contraseña sea correcta" -ForegroundColor Yellow
    }
}
else {
    Write-Host "PostgreSQL no encontrado en la ruta esperada" -ForegroundColor Red
    Write-Host "Por favor, instala PostgreSQL o verifica la ruta de instalación" -ForegroundColor Yellow
}

Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
