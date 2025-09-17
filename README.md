# 🚜 CompareMachine - Sistema de Comparación de Maquinaria Pesada

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Un sistema web moderno para comparar y evaluar maquinaria pesada industrial, con funcionalidades especializadas para análisis de criterios de juntas en equipos de construcción.

## ✨ Características Principales

### 🔍 **Comparación de Maquinaria**
- Catálogo completo de equipos pesados (excavadoras, bulldozers, cargadores, grúas, etc.)
- Filtros avanzados por categoría, fabricante, precio, peso y potencia
- Vista detallada con especificaciones técnicas completas
- Sistema de calificaciones y estado de disponibilidad
- Búsqueda inteligente y ordenamiento dinámico

### ⚙️ **Evaluación de Criterios de Juntas**
- **Análisis especializado** para evaluación de juntas en maquinaria
- Cálculos automáticos basados en fórmulas específicas de la industria
- Recomendaciones automáticas: `MACHINE`, `CHANGE PIN`, `CHANGE BUSHINGS`
- Tabla dinámica con múltiples evaluaciones simultáneas
- Exportación de resultados a CSV
- Subida de fotos por cada evaluación

### 🛠️ **Gestión de Equipos**
- Formulario completo para agregar nueva maquinaria
- Validación robusta de datos con Yup
- Integración con API mock para desarrollo
- Sistema de edición y eliminación de equipos

## 🏗️ Arquitectura Técnica

### **Stack Tecnológico**
- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS
- **Routing:** React Router DOM
- **Estado:** Context API + React Query
- **Formularios:** React Hook Form + Yup
- **Gráficos:** Recharts
- **Iconos:** Lucide React

### **Estructura del Proyecto**
```
src/
├── atoms/          # Componentes básicos reutilizables
├── molecules/      # Componentes compuestos
├── organisms/      # Componentes complejos
├── pages/          # Páginas principales
├── hooks/          # Lógica personalizada
├── services/       # API y servicios
├── types/          # Definiciones TypeScript
└── context/        # Estado global
```

## 🚀 Instalación y Uso

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/fradurgo19/CompareMachine.git

# Navegar al directorio
cd CompareMachine

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### **Scripts Disponibles**
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter de código
```

## 📊 Funcionalidades Detalladas

### **Comparación de Maquinaria**
- **Filtros:** Categoría, fabricante, rango de precio, peso, potencia, disponibilidad
- **Ordenamiento:** Por cualquier campo de especificaciones
- **Vista detallada:** Modal con especificaciones completas e imágenes
- **Exportación:** Descarga de reportes de comparación

### **Evaluación de Criterios**
- **Fórmulas implementadas:**
  - `CRITERION`: `IF(Standard Diameter > 60, 1.2, 1)`
  - `A-E, A-P, E-P, B-E, B-P`: Cálculos de evaluación
  - `CRITERIA`: Recomendaciones automáticas
- **Tabla dinámica:** Agregar/eliminar filas de evaluación
- **Exportación CSV:** Resultados completos exportables
- **Subida de fotos:** Evidencia visual por evaluación

## 🎨 Diseño y UX

- **Diseño moderno** con Tailwind CSS
- **Responsive** para todos los dispositivos
- **Componentes reutilizables** siguiendo Atomic Design
- **Tema claro/oscuro** configurable
- **Iconografía consistente** con Lucide React
- **Animaciones suaves** y transiciones

## 🔧 Configuración de Desarrollo

### **Variables de Entorno**
```bash
# Crear archivo .env.local
VITE_API_URL=your_api_url
VITE_APP_NAME=CompareMachine
```

### **Estructura de Datos**
```typescript
interface Machinery {
  id: string;
  name: string;
  model: string;
  series: string;
  category: MachineryCategory;
  manufacturer: string;
  images: string[];
  specifications: MachinerySpecifications;
  price?: number;
  availability: 'available' | 'limited' | 'unavailable';
  rating: number;
  createdAt: string;
}
```

## 📈 Roadmap

- [ ] **Integración con base de datos real**
- [ ] **Sistema de autenticación de usuarios**
- [ ] **Panel de administración avanzado**
- [ ] **API REST completa**
- [ ] **Notificaciones en tiempo real**
- [ ] **Sistema de reportes avanzado**
- [ ] **Integración con sistemas ERP**
- [ ] **App móvil nativa**

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Frank Duran**
- GitHub: [@fradurgo19](https://github.com/fradurgo19)
- LinkedIn: [Frank Duran](https://linkedin.com/in/frank-duran)

## 🙏 Agradecimientos

- [React](https://reactjs.org/) - Biblioteca de UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework de CSS
- [Vite](https://vitejs.dev/) - Herramienta de build
- [Lucide React](https://lucide.dev/) - Iconos
- [Recharts](https://recharts.org/) - Gráficos

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐
