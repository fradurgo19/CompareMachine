# 🗄️ Scripts SQL para Neon Database - CompareMachine

## 📋 Archivos SQL Creados

### 1. **`neon-database-schema.sql`** - Estructura de la Base de Datos
- ✅ Creación de tipos ENUM
- ✅ Creación de todas las tablas
- ✅ Índices únicos y de optimización
- ✅ Claves foráneas
- ✅ Comentarios de documentación

### 2. **`neon-sample-data.sql`** - Datos de Ejemplo
- ✅ 2 usuarios (Admin y Regular)
- ✅ 4 máquinas de ejemplo
- ✅ Especificaciones técnicas completas
- ✅ 2 evaluaciones de juntas

## 🚀 Cómo Ejecutar en Neon

### **PASO 1: Ejecutar Schema (Estructura)**
1. Ir a Neon Dashboard
2. Abrir **"SQL Editor"**
3. Copiar y pegar el contenido de `neon-database-schema.sql`
4. Hacer clic en **"Run"**

### **PASO 2: Ejecutar Sample Data (Datos)**
1. En el mismo SQL Editor
2. Copiar y pegar el contenido de `neon-sample-data.sql`
3. Hacer clic en **"Run"**

## 📊 Estructura de Tablas Creadas

### **Tabla: users**
```sql
- id (TEXT, PRIMARY KEY)
- email (TEXT, UNIQUE)
- name (TEXT)
- password (TEXT)
- role (UserRole ENUM: ADMIN, USER)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### **Tabla: machinery**
```sql
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- model (TEXT)
- series (TEXT)
- category (MachineryCategory ENUM)
- manufacturer (TEXT)
- images (TEXT[])
- price (DOUBLE PRECISION)
- availability (Availability ENUM)
- rating (DOUBLE PRECISION)
- userId (TEXT, FOREIGN KEY)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### **Tabla: machinery_specifications**
```sql
- id (TEXT, PRIMARY KEY)
- weight (DOUBLE PRECISION)
- power (DOUBLE PRECISION)
- maxOperatingWeight (DOUBLE PRECISION)
- bucketCapacity (DOUBLE PRECISION, NULLABLE)
- maxDigDepth (DOUBLE PRECISION, NULLABLE)
- maxReach (DOUBLE PRECISION, NULLABLE)
- transportLength (DOUBLE PRECISION)
- transportWidth (DOUBLE PRECISION)
- transportHeight (DOUBLE PRECISION)
- engineModel (TEXT)
- fuelCapacity (DOUBLE PRECISION)
- hydraulicSystem (TEXT, NULLABLE)
- machineryId (TEXT, FOREIGN KEY)
```

### **Tabla: joint_evaluations**
```sql
- id (TEXT, PRIMARY KEY)
- joint (INTEGER)
- standardDiameter (DOUBLE PRECISION)
- structureHousingDiameter (DOUBLE PRECISION)
- bushingDiameter (DOUBLE PRECISION)
- pinDiameter (DOUBLE PRECISION)
- criterion (DOUBLE PRECISION)
- aeResult (INTEGER)
- apResult (INTEGER)
- epResult (INTEGER)
- beResult (INTEGER)
- bpResult (INTEGER)
- criteria (TEXT[])
- model (TEXT)
- series (TEXT)
- ott (TEXT)
- photos (TEXT[])
- userId (TEXT, FOREIGN KEY)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## 🔧 Tipos ENUM Creados

### **UserRole**
- ADMIN
- USER

### **MachineryCategory**
- EXCAVATORS
- BULLDOZERS
- LOADERS
- CRANES
- DUMP_TRUCKS
- COMPACTORS
- GRADERS

### **Availability**
- AVAILABLE
- LIMITED
- UNAVAILABLE

## 📈 Datos de Ejemplo Incluidos

### **Usuarios:**
- **Admin**: admin@comparemachine.com / admin123
- **Usuario**: user@comparemachine.com / user123

### **Maquinaria:**
1. **CAT 320 Hydraulic Excavator** - Caterpillar
2. **John Deere 850K Crawler Dozer** - John Deere
3. **Komatsu PC240LC-11 Excavator** - Komatsu
4. **Volvo L120H Wheel Loader** - Volvo

### **Evaluaciones de Juntas:**
- 2 evaluaciones de ejemplo con cálculos completos

## ✅ Verificación Post-Ejecución

Después de ejecutar ambos scripts, deberías ver:

```sql
-- Verificar tablas creadas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Verificar datos insertados
SELECT 'Users' as table_name, COUNT(*) as record_count FROM "users"
UNION ALL
SELECT 'Machinery' as table_name, COUNT(*) as record_count FROM "machinery"
UNION ALL
SELECT 'Machinery Specifications' as table_name, COUNT(*) as record_count FROM "machinery_specifications"
UNION ALL
SELECT 'Joint Evaluations' as table_name, COUNT(*) as record_count FROM "joint_evaluations";
```

## 🚨 Importante

1. **Ejecutar en orden**: Primero schema, luego datos
2. **Verificar errores**: Revisar la consola de Neon
3. **Backup**: Neon hace backup automático
4. **SSL**: Usar `?sslmode=require` en connection string

## 📞 Siguiente Paso

Una vez ejecutados los scripts SQL:
1. ✅ Base de datos lista en Neon
2. 🔄 Desplegar Backend en Vercel
3. 🔄 Desplegar Frontend en Vercel
4. 🔄 Configurar variables de entorno
