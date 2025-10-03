# 🚀 Instrucciones de Deploy - Nuevo Schema de Especificaciones

## ✅ Cambios Implementados

Se ha actualizado completamente el sistema para manejar TODAS las especificaciones detalladas de maquinaria:

### 📊 Nuevos Campos en Base de Datos

1. **Region Offerings** - Array de strings
2. **Operating Weight Range**
   - Canopy Version (kg)
   - Cab Version (kg)
3. **Bucket Capacity** (m³)
4. **Emission Standards**
   - EU Standard
   - EPA Standard
5. **Engine Model & Rated Power**
   - ISO9249 (kW) - **REQUERIDO**
   - SAE J1349 (kW)
   - EEC 80/1269 (kW)
   - Number of Cylinders
   - Bore × Stroke (mm)
   - Piston Displacement (L)
6. **Relief Valve Settings**
   - Implement Circuit (MPa)
   - Swing Circuit (MPa)
   - Travel Circuit (MPa)
   - Max Travel Speed Hi/Low (km/h)
   - Swing Speed (min⁻¹)
7. **Undercarriage Specifications**
   - Standard Track Shoe Width (mm)
   - Undercarriage Length (mm)
   - Undercarriage Width (mm)
   - Undercarriage Width Extend/Retract (mm)
8. **Capacity (Refilled)**
   - Fuel Tank Capacity (L) - **REQUERIDO**
   - Hydraulic System Capacity (L)

### 🔄 Compatibilidad

- ✅ Campos antiguos mantenidos para backward compatibility
- ✅ Migración automática de datos existentes
- ✅ Los campos requeridos ahora son: `engineModel`, `ratedPowerISO9249`, `fuelTankCapacity`

## 📋 Pasos para Deploy

### 1. Preparar la Base de Datos

**IMPORTANTE**: Necesitarás ejecutar migraciones en producción.

#### A. Desarrollo Local (Opcional - Testing)

```bash
cd backend
npx prisma migrate dev --name add_complete_specifications
```

Esto generará la migración y la aplicará en tu BD local.

#### B. Producción (Neon Database)

**Opción 1: Push Directo (Recomendado para este caso)**

```bash
cd backend
npx prisma db push
```

Esto aplicará los cambios directamente sin crear archivos de migración.

**Opción 2: Migrations (Más control)**

```bash
cd backend
npx prisma migrate deploy
```

### 2. Deployment en Vercel

#### Backend

```bash
# Desde la raíz del proyecto
git add .
git commit -m "feat: Add complete machinery specifications schema"
git push origin main
```

Vercel detectará los cambios y hará auto-deploy.

**NOTA IMPORTANTE**: Las migraciones de Prisma se ejecutarán automáticamente durante el build de Vercel gracias al comando `prisma generate` en el `build` script.

#### Frontend

El frontend se deployará automáticamente junto con el push.

### 3. Verificación Post-Deploy

#### A. Verificar Backend API

```bash
curl https://your-backend.vercel.app/health
```

Debe retornar:
```json
{
  "success": true,
  "message": "API de CompareMachine está funcionando"
}
```

#### B. Verificar Base de Datos

Conéctate a Neon Dashboard y verifica que la tabla `machinery_specifications` tiene los nuevos campos.

#### C. Probar Parser

1. Ve a https://compare-machine.vercel.app/add-machinery
2. Copia y pega el siguiente texto de ejemplo:

```
ZX-5A Mini Excavator Series Specifications
Model ZX38U-5A ZX48U-5A ZX55U-5A ZX65USB-5A
Region Offerings
SE Asia, Oceania SE Asia, Oceania SE Asia, Oceania
Europe, Russia・CIS Europe, Russia・CIS Europe, Russia・CIS
Operating Weight Range ;
Canopy version kg 3 770 - 4 000 4 730 - 4 930 5 040 - 5 240 —
Cab version kg 3 940 - 4 170 4 860 - 5 060 5 170 - 5 370 6 140 - 6 290
Bucket Capacity Range
(ISO heaped)
m3 0.10 0.11 0.14 0.22
Emission Standard; EU Stage III A Stage III A Stage III A
EPA Interim Tire4 Interim Tire4 Interim Tire4
Engine Model Yanmar Yanmer Yanmar
EDM-3TNV88 EDM-4TNV88 4TNV94L-ZWHB
Rated Power ;
ISO9249,net kW 21.2 28.2 34.1
SAE J1349, net kW 21.2 28.2 34.1
EEC 80/1269, net kW 21.2 28.2 34.1
No. of Cylinders 3 4 4
Bore × Stroke mm 88 x 90 88 x 90 94 x 110
Piston Displacement L 1.642 2.189 3.053
Relief Valve Settings;
Implement Circuit MPa 24.5 24.5 24.5
Swing Circuit MPa 18.6 18.3 19.6
Travel Circuit MPa 24.5 24.5 25.7
Max. Travel Speed Hi / Low km/h 4.3 / 2.8 4.2 / 2.5 4.8 / 2.9
Swing Speed min-1 9.1 9.0 9.5
Standard Track Shoe Width mm 300 400 400
Undercarriage Length mm 2 110 2 500 2 500
Undercarriage Width mm 1 740 / — 1 960 / — 2 000 / — 2 000 / —
(Extend / Retract)
Capacity (Refilled);
Fuel Tank L 42.0 70.0 120.0
Hydraulic System (incl. oil tank) L 88.0 108.0 168.0
```

3. Haz clic en "Parsear Especificaciones"
4. Verifica que se extraigan 4 máquinas (o 3 si una no tiene Canopy version)
5. Revisa que todos los campos se muestren correctamente
6. Haz clic en "Agregar X Máquina(s)"
7. Verifica que se agreguen correctamente a la base de datos

## 🐛 Troubleshooting

### Error: "Prisma Client not generated"

```bash
cd backend
npx prisma generate
npm run build
```

### Error: Database connection timeout

- Verifica que `DATABASE_URL` en Vercel apunte a Neon
- Verifica que la connection string tenga `?sslmode=require`

### Error: "Missing required field"

Si ves errores de campos requeridos, verifica que el parser esté extrayendo:
- `engineModel`
- `ratedPowerISO9249`
- `fuelTankCapacity`

### Parser no detecta campos

Verifica que el texto pegado tenga:
1. Línea con "Model" y los nombres de modelos
2. Línea "ISO9249,net kW" o similar
3. Línea "Fuel Tank L" o similar

## 📊 Migración de Datos Existentes

Si tienes máquinas en la BD con el schema antiguo:

```sql
-- Esto se maneja automáticamente porque los campos antiguos son opcionales
-- Pero si quieres migrar datos:

UPDATE machinery_specifications
SET 
  ratedPowerISO9249 = COALESCE(power, 0),
  fuelTankCapacity = COALESCE("fuelCapacity", 0)
WHERE ratedPowerISO9249 IS NULL OR fuelTankCapacity IS NULL;
```

**NO ES NECESARIO** ejecutar esto si usas `prisma db push` - Prisma maneja la migración.

## ✅ Checklist de Deploy

- [ ] Backend compilado exitosamente (`npm run build`)
- [ ] Schema de Prisma formateado (`npx prisma format`)
- [ ] Commit y push a Git
- [ ] Vercel backend deployed
- [ ] Vercel frontend deployed
- [ ] Migraciones aplicadas en Neon
- [ ] Health check pasando
- [ ] Parser probado con texto de ejemplo
- [ ] Máquinas agregadas correctamente
- [ ] UI mostrando todos los nuevos campos

## 📚 Archivos Modificados

### Backend
- ✅ `backend/prisma/schema.prisma` - Schema actualizado
- ✅ `backend/src/controllers/textParserController.ts` - Parser completo
- ✅ `backend/src/validators/machinery.ts` - Validadores actualizados

### Frontend
- ✅ `frontend/src/components/TextSpecificationParser.tsx` - UI actualizada
- ✅ Interfaces TypeScript actualizadas

## 🎯 Resultado Esperado

Después del deploy, los usuarios podrán:

1. **Copiar y pegar** tablas completas de especificaciones
2. **Ver TODOS los campos** extraídos automáticamente:
   - Pesos (Canopy y Cab versions)
   - Potencia detallada (ISO9249, SAE J1349, EEC)
   - Información del motor (cilindros, bore×stroke, desplazamiento)
   - Capacidades (balde, combustible, hidráulico)
   - Dimensiones del tren de rodaje
   - Velocidades y rendimiento
   - Estándares de emisiones
3. **Agregar múltiples máquinas** simultáneamente
4. **Visualizar especificaciones completas** en la UI

## 💰 Costo

- ✅ **$0.00** - Todo gratuito
- ✅ Sin APIs externas
- ✅ Sin costos adicionales

---

**Versión**: 2.0.0  
**Fecha**: Octubre 2025  
**Status**: ✅ Listo para Deploy

