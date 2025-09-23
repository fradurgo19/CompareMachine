-- 🗄️ Script SQL para crear todas las tablas en Neon Database
-- CompareMachine - Sistema de Comparación de Maquinaria Pesada

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos ENUM
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "MachineryCategory" AS ENUM ('EXCAVATORS', 'BULLDOZERS', 'LOADERS', 'CRANES', 'DUMP_TRUCKS', 'COMPACTORS', 'GRADERS');
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'LIMITED', 'UNAVAILABLE');

-- Tabla: users
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- Tabla: machinery
CREATE TABLE "machinery" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "category" "MachineryCategory" NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "images" TEXT[],
    "price" DOUBLE PRECISION,
    "availability" "Availability" NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "machinery_pkey" PRIMARY KEY ("id")
);

-- Tabla: machinery_specifications
CREATE TABLE "machinery_specifications" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "maxOperatingWeight" DOUBLE PRECISION NOT NULL,
    "bucketCapacity" DOUBLE PRECISION,
    "maxDigDepth" DOUBLE PRECISION,
    "maxReach" DOUBLE PRECISION,
    "transportLength" DOUBLE PRECISION NOT NULL,
    "transportWidth" DOUBLE PRECISION NOT NULL,
    "transportHeight" DOUBLE PRECISION NOT NULL,
    "engineModel" TEXT NOT NULL,
    "fuelCapacity" DOUBLE PRECISION NOT NULL,
    "hydraulicSystem" TEXT,
    "machineryId" TEXT NOT NULL,

    CONSTRAINT "machinery_specifications_pkey" PRIMARY KEY ("id")
);

-- Tabla: joint_evaluations
CREATE TABLE "joint_evaluations" (
    "id" TEXT NOT NULL,
    "joint" INTEGER NOT NULL,
    "standardDiameter" DOUBLE PRECISION NOT NULL,
    "structureHousingDiameter" DOUBLE PRECISION NOT NULL,
    "bushingDiameter" DOUBLE PRECISION NOT NULL,
    "pinDiameter" DOUBLE PRECISION NOT NULL,
    "criterion" DOUBLE PRECISION NOT NULL,
    "aeResult" INTEGER NOT NULL,
    "apResult" INTEGER NOT NULL,
    "epResult" INTEGER NOT NULL,
    "beResult" INTEGER NOT NULL,
    "bpResult" INTEGER NOT NULL,
    "criteria" TEXT[],
    "model" TEXT NOT NULL,
    "series" TEXT NOT NULL,
    "ott" TEXT NOT NULL,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "joint_evaluations_pkey" PRIMARY KEY ("id")
);

-- Crear índices únicos
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "machinery_name_model_key" ON "machinery"("name", "model");
CREATE UNIQUE INDEX "machinery_specifications_machineryId_key" ON "machinery_specifications"("machineryId");
CREATE UNIQUE INDEX "joint_evaluations_joint_userId_key" ON "joint_evaluations"("joint", "userId");

-- Crear claves foráneas
ALTER TABLE "machinery" ADD CONSTRAINT "machinery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "machinery_specifications" ADD CONSTRAINT "machinery_specifications_machineryId_fkey" FOREIGN KEY ("machineryId") REFERENCES "machinery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "joint_evaluations" ADD CONSTRAINT "joint_evaluations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Crear índices para optimización
CREATE INDEX "machinery_category_idx" ON "machinery"("category");
CREATE INDEX "machinery_manufacturer_idx" ON "machinery"("manufacturer");
CREATE INDEX "machinery_availability_idx" ON "machinery"("availability");
CREATE INDEX "joint_evaluations_userId_idx" ON "joint_evaluations"("userId");
CREATE INDEX "joint_evaluations_model_idx" ON "joint_evaluations"("model");
CREATE INDEX "joint_evaluations_series_idx" ON "joint_evaluations"("series");

-- Comentarios para documentación
COMMENT ON TABLE "users" IS 'Usuarios del sistema CompareMachine';
COMMENT ON TABLE "machinery" IS 'Catálogo de maquinaria pesada';
COMMENT ON TABLE "machinery_specifications" IS 'Especificaciones técnicas de la maquinaria';
COMMENT ON TABLE "joint_evaluations" IS 'Evaluaciones de juntas de maquinaria';

COMMENT ON COLUMN "users"."role" IS 'Rol del usuario: ADMIN o USER';
COMMENT ON COLUMN "machinery"."category" IS 'Categoría de maquinaria: EXCAVATORS, BULLDOZERS, etc.';
COMMENT ON COLUMN "machinery"."availability" IS 'Disponibilidad: AVAILABLE, LIMITED, UNAVAILABLE';
COMMENT ON COLUMN "joint_evaluations"."criteria" IS 'Criterios de evaluación: MACHINE, CHANGE PIN, CHANGE BUSHINGS';

-- Verificar que las tablas se crearon correctamente
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Mostrar estructura de las tablas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;
