# 🚜 CompareMachine Backend API

Backend API para el sistema de comparación de maquinaria pesada con evaluación de criterios de juntas.

## 🏗️ Arquitectura

- **Node.js + Express + TypeScript**
- **Base de datos:** PostgreSQL con Prisma ORM
- **Autenticación:** JWT
- **Validación:** Zod
- **Documentación:** Swagger/OpenAPI
- **Testing:** Jest + Supertest

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp env.example .env
```

Editar el archivo `.env` con tus configuraciones:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/compare_machine_db"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

3. **Configurar base de datos:**
```bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar base de datos con datos de ejemplo
npm run db:seed
```

4. **Iniciar servidor:**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere autenticación)

### Maquinaria
- `GET /api/machinery` - Listar maquinaria (con filtros y paginación)
- `GET /api/machinery/:id` - Obtener maquinaria por ID
- `POST /api/machinery` - Crear maquinaria (requiere admin)
- `PUT /api/machinery/:id` - Actualizar maquinaria (requiere admin)
- `DELETE /api/machinery/:id` - Eliminar maquinaria (requiere admin)
- `GET /api/machinery/manufacturers` - Obtener lista de fabricantes

### Evaluaciones de Juntas
- `GET /api/joint-evaluations` - Listar evaluaciones (requiere autenticación)
- `GET /api/joint-evaluations/:id` - Obtener evaluación por ID
- `POST /api/joint-evaluations` - Crear evaluación (requiere autenticación)
- `PUT /api/joint-evaluations/:id` - Actualizar evaluación (requiere autenticación)
- `DELETE /api/joint-evaluations/:id` - Eliminar evaluación (requiere autenticación)
- `POST /api/joint-evaluations/calculate` - Calcular evaluación sin guardar

### Usuarios
- `GET /api/users/profile` - Obtener perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil de usuario
- `GET /api/users/joint-evaluations` - Obtener evaluaciones del usuario

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo con hot reload
npm run build        # Compilar TypeScript
npm start           # Iniciar servidor en producción
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run test:coverage # Tests con cobertura
npm run db:generate # Generar cliente Prisma
npm run db:push     # Sincronizar esquema con BD
npm run db:migrate  # Ejecutar migraciones
npm run db:studio   # Abrir Prisma Studio
npm run db:seed     # Poblar BD con datos de ejemplo
npm run lint        # Linter de código
npm run lint:fix    # Corregir errores de linting
```

## 📊 Documentación API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

**http://localhost:3001/api-docs**

## 🔐 Autenticación

La API utiliza JWT para autenticación. Incluye el token en el header Authorization:

```
Authorization: Bearer <tu-token-jwt>
```

### Usuarios de Prueba

Después de ejecutar el seed, tendrás estos usuarios disponibles:

- **Admin:** `admin@comparemachine.com` / `admin123`
- **Usuario:** `user@comparemachine.com` / `user123`

## 🗄️ Base de Datos

### Modelos Principales

- **User:** Usuarios del sistema
- **Machinery:** Maquinaria pesada
- **MachinerySpecifications:** Especificaciones técnicas
- **JointEvaluation:** Evaluaciones de juntas

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy
```

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Tests con cobertura
npm run test:coverage
```

## 🚀 Deploy

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
```

### Build para Producción

```bash
npm run build
npm start
```

## 📝 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/     # Controladores de rutas
│   ├── middleware/      # Middleware personalizado
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── types/           # Tipos TypeScript
│   ├── utils/           # Utilidades
│   ├── validators/      # Validaciones con Zod
│   └── index.ts         # Punto de entrada
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos de ejemplo
├── dist/                # Código compilado
└── package.json
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](../LICENSE) para más detalles.

## 👨‍💻 Autor

**Frank Duran**
- GitHub: [@fradurgo19](https://github.com/fradurgo19)
