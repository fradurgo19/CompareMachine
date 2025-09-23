-- 🌱 Script SQL para insertar datos de ejemplo en Neon Database
-- CompareMachine - Datos iniciales para testing

-- Insertar usuarios de ejemplo
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt") VALUES
('clx1234567890abcdef', 'admin@comparemachine.com', 'Admin User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'ADMIN', NOW(), NOW()),
('clx0987654321fedcba', 'user@comparemachine.com', 'Regular User', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J8K8K8K8K', 'USER', NOW(), NOW());

-- Insertar maquinaria de ejemplo
INSERT INTO "machinery" ("id", "name", "model", "series", "category", "manufacturer", "images", "price", "availability", "rating", "createdAt", "updatedAt", "userId") VALUES
('clx1111111111111111', 'CAT 320 Hydraulic Excavator', '320', 'Next Generation', 'EXCAVATORS', 'Caterpillar', 
 ARRAY['https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg', 'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'], 
 285000.00, 'AVAILABLE', 4.5, NOW(), NOW(), 'clx1234567890abcdef'),

('clx2222222222222222', 'John Deere 850K Crawler Dozer', '850K', 'K-Series', 'BULLDOZERS', 'John Deere', 
 ARRAY['https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg', 'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'], 
 420000.00, 'AVAILABLE', 4.7, NOW(), NOW(), 'clx1234567890abcdef'),

('clx3333333333333333', 'Komatsu PC240LC-11 Excavator', 'PC240LC-11', 'Dash-11', 'EXCAVATORS', 'Komatsu', 
 ARRAY['https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg', 'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'], 
 320000.00, 'LIMITED', 4.3, NOW(), NOW(), 'clx1234567890abcdef'),

('clx4444444444444444', 'Volvo L120H Wheel Loader', 'L120H', 'H-Series', 'LOADERS', 'Volvo', 
 ARRAY['https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg', 'https://images.pexels.com/photos/162539/architecture-building-site-build-construction-162539.jpeg'], 
 380000.00, 'AVAILABLE', 4.6, NOW(), NOW(), 'clx1234567890abcdef');

-- Insertar especificaciones técnicas
INSERT INTO "machinery_specifications" ("id", "weight", "power", "maxOperatingWeight", "bucketCapacity", "maxDigDepth", "maxReach", "transportLength", "transportWidth", "transportHeight", "engineModel", "fuelCapacity", "hydraulicSystem", "machineryId") VALUES
('clx5555555555555555', 20.2, 122.0, 20200.0, 0.91, 6.52, 9.9, 9.53, 2.55, 3.15, 'Cat C4.4 ACERT', 410.0, 'Advanced Hydraulic System', 'clx1111111111111111'),

('clx6666666666666666', 18.7, 215.0, 18700.0, NULL, NULL, NULL, 5.89, 3.05, 3.12, 'John Deere PowerTech PSS', 340.0, NULL, 'clx2222222222222222'),

('clx7777777777777777', 24.1, 177.0, 24100.0, 1.14, 6.84, 10.25, 10.12, 2.8, 3.18, 'Komatsu SAA6D107E-3', 400.0, 'CLSS (Closed-Load Sensing System)', 'clx3333333333333333'),

('clx8888888888888888', 17.2, 240.0, 17200.0, 3.2, NULL, NULL, 8.78, 2.7, 3.45, 'Volvo D8J', 300.0, NULL, 'clx4444444444444444');

-- Insertar evaluaciones de juntas de ejemplo
INSERT INTO "joint_evaluations" ("id", "joint", "standardDiameter", "structureHousingDiameter", "bushingDiameter", "pinDiameter", "criterion", "aeResult", "apResult", "epResult", "beResult", "bpResult", "criteria", "model", "series", "ott", "photos", "createdAt", "updatedAt", "userId") VALUES
('clx9999999999999999', 1, 65.5, 68.2, 66.8, 64.1, 1.2, 1, 1, 0, 1, 1, ARRAY['MACHINE', 'CHANGE BUSHINGS'], '320', 'Next Generation', 'CAT-320-001', ARRAY[], NOW(), NOW(), 'clx0987654321fedcba'),

('clxaaaaaaaaaaaaaaaa', 2, 45.2, 47.8, 46.5, 44.1, 1.0, 1, 1, 1, 1, 1, ARRAY['MACHINE', 'CHANGE PIN', 'CHANGE BUSHINGS'], '850K', 'K-Series', 'JD-850K-002', ARRAY[], NOW(), NOW(), 'clx0987654321fedcba');

-- Verificar datos insertados
SELECT 'Users' as table_name, COUNT(*) as record_count FROM "users"
UNION ALL
SELECT 'Machinery' as table_name, COUNT(*) as record_count FROM "machinery"
UNION ALL
SELECT 'Machinery Specifications' as table_name, COUNT(*) as record_count FROM "machinery_specifications"
UNION ALL
SELECT 'Joint Evaluations' as table_name, COUNT(*) as record_count FROM "joint_evaluations";

-- Mostrar usuarios creados
SELECT id, email, name, role, "createdAt" FROM "users";

-- Mostrar maquinaria creada
SELECT id, name, model, manufacturer, category, availability, rating FROM "machinery";

-- Mostrar evaluaciones de juntas
SELECT id, joint, model, series, ott, "createdAt" FROM "joint_evaluations";
