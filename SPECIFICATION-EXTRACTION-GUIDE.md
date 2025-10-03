# Guía de Extracción Automática de Especificaciones

## 📋 Descripción General

Esta funcionalidad permite extraer automáticamente especificaciones de maquinaria pesada desde imágenes o archivos PDF utilizando Inteligencia Artificial (OpenAI GPT-4 Vision).

## ✨ Características

- ✅ Soporta imágenes (JPG, PNG, WEBP) y archivos PDF
- ✅ Extracción automática de múltiples máquinas desde un solo documento
- ✅ Procesamiento inteligente de tablas de especificaciones
- ✅ Conversión automática de unidades
- ✅ Interfaz visual intuitiva con vista previa de datos extraídos
- ✅ Validación y corrección de datos antes de guardar

## 🚀 Configuración

### 1. Requisitos Previos

- Cuenta de OpenAI con acceso a la API
- Node.js 18+ instalado
- Proyecto CompareMachine configurado

### 2. Obtener API Key de OpenAI

1. Visita [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Inicia sesión con tu cuenta de OpenAI
3. Haz clic en "Create new secret key"
4. Copia la clave generada (solo se muestra una vez)

### 3. Configurar Variables de Entorno

#### Desarrollo Local

Edita el archivo `backend/config.env`:

```env
# OpenAI API Configuration
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

#### Producción (Vercel)

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings → Environment Variables
3. Agrega una nueva variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI
   - **Environment**: Production (y Preview si deseas)
4. Redeploy tu backend para aplicar cambios

### 4. Instalar Dependencias

Las siguientes dependencias ya están incluidas en el proyecto:

```bash
cd backend
npm install openai pdf-parse sharp
```

## 📖 Uso

### Para Usuarios Finales

1. **Accede a la página de agregar maquinaria**
   - Navega a `/add-machinery` en la aplicación
   - URL: https://compare-machine.vercel.app/add-machinery

2. **Selecciona la pestaña "Extraer de Imagen/PDF"**
   - Esta es la opción predeterminada al abrir la página

3. **Sube tu archivo**
   - Arrastra y suelta el archivo en el área designada, o
   - Haz clic para seleccionar desde tu computadora
   - Tipos aceptados: JPG, PNG, WEBP, PDF
   - Tamaño máximo: 10MB

4. **Extrae las especificaciones**
   - Haz clic en "Extraer Especificaciones"
   - El sistema analizará el documento con IA (toma 5-15 segundos)
   - Se mostrarán todas las máquinas detectadas

5. **Revisa y confirma**
   - Revisa los datos extraídos en la vista previa
   - Verifica que la información sea correcta
   - Haz clic en "Agregar X Máquina(s)" para guardar

### Formato de Documentos Soportados

La IA puede procesar tablas de especificaciones como la siguiente:

```
Model              ZX17U-5A    ZX19U-5A    ZX26U-5A
Manufacturer       Hitachi     Hitachi     Hitachi
Weight (kg)        1760        2630        3320
Power (kW)         10.6        14.5        21.2
Engine Model       3TNV70      3TNV76      EDM-3TNV88
Fuel Capacity (L)  20.0        33.4        42.0
```

**Nota:** El sistema es inteligente y puede adaptarse a diferentes formatos de tablas.

## 🔧 Funcionalidad Técnica

### Backend

**Endpoint**: `POST /api/extraction/specifications`

**Autenticación**: Requerida (Bearer Token)

**Request**:
- Content-Type: `multipart/form-data`
- Field: `file` (imagen o PDF)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "model": "ZX17U-5A",
      "name": "Hitachi ZX17U-5A Mini Excavator",
      "series": "ZX-5A",
      "manufacturer": "Hitachi",
      "category": "EXCAVATORS",
      "specifications": {
        "weight": 1.76,
        "power": 14.2,
        "maxOperatingWeight": 1760,
        "bucketCapacity": 0.05,
        "engineModel": "Yanmar 3TNV70",
        "fuelCapacity": 20.0,
        "transportLength": 3.77,
        "transportWidth": 1.28,
        "transportHeight": 2.48,
        "hydraulicSystem": "40.0"
      },
      "availability": "AVAILABLE"
    }
  ],
  "message": "Se extrajeron 1 máquina(s) del documento"
}
```

### Proceso de Extracción

1. **Validación de archivo**
   - Tipo de archivo permitido
   - Tamaño máximo (10MB)

2. **Procesamiento según tipo**
   - **PDF**: Extrae texto con `pdf-parse`, analiza con GPT-4o-mini
   - **Imagen**: Optimiza con `sharp`, analiza con GPT-4o-mini Vision

3. **Análisis con IA**
   - GPT-4o-mini identifica tablas y especificaciones
   - Extrae datos de TODAS las máquinas en el documento
   - Convierte unidades automáticamente
   - Estructura los datos en formato JSON

4. **Retorno de datos**
   - Array de objetos con todas las máquinas detectadas
   - Datos listos para inserción en la base de datos

## 💰 Costos de OpenAI

### GPT-4o-mini Pricing (Febrero 2025)

- **Input**: ~$0.15 por 1M tokens
- **Output**: ~$0.60 por 1M tokens

### Estimación por Uso

- **Imagen típica** (tabla de especificaciones): ~$0.01 - $0.02 por extracción
- **PDF típico** (1-2 páginas): ~$0.005 - $0.015 por extracción

**Ejemplo mensual** (100 extracciones/mes): ~$1.00 - $2.00 USD

## 🔒 Seguridad

- ✅ Autenticación requerida (JWT)
- ✅ Validación de tipo de archivo
- ✅ Límite de tamaño de archivo (10MB)
- ✅ API key de OpenAI en variables de entorno (no en código)
- ✅ Rate limiting aplicado
- ✅ Archivos procesados en memoria (no se guardan en disco)

## 🐛 Solución de Problemas

### Error: "No OPENAI_API_KEY configured"

**Solución**: Verifica que la variable de entorno `OPENAI_API_KEY` esté configurada correctamente.

```bash
# Verificar en local
echo $OPENAI_API_KEY  # Linux/Mac
echo %OPENAI_API_KEY%  # Windows CMD
$env:OPENAI_API_KEY    # Windows PowerShell
```

### Error: "Error al extraer especificaciones"

**Posibles causas**:
1. Imagen de baja calidad o ilegible
2. Formato de tabla no reconocido
3. API key de OpenAI inválida o sin créditos
4. Límite de rate de OpenAI excedido

**Soluciones**:
1. Usa imágenes de alta resolución
2. Asegúrate que el texto sea legible
3. Verifica tu cuenta de OpenAI
4. Espera unos minutos y vuelve a intentar

### Error: "Tipo de archivo no soportado"

**Solución**: Solo se aceptan:
- Imágenes: JPG, PNG, WEBP
- Documentos: PDF

### Baja precisión en la extracción

**Recomendaciones**:
1. Usa imágenes de alta calidad (>1000px de ancho)
2. Asegura buena iluminación y contraste
3. Evita imágenes con texto girado o distorsionado
4. Para PDFs, usa PDFs nativos (no escaneados cuando sea posible)

## 📊 Limitaciones

- Máximo 10MB por archivo
- Procesamiento puede tardar 5-15 segundos
- Requiere conexión a Internet
- Depende de la disponibilidad de la API de OpenAI
- La precisión depende de la calidad del documento

## 🔄 Alternativas Futuras

Si OpenAI resulta costoso a largo plazo, considerar:

1. **Google Cloud Vision API**
   - Más económico para OCR puro
   - Requiere procesamiento adicional de datos

2. **Tesseract OCR (Open Source)**
   - Gratuito
   - Requiere más procesamiento y limpieza de datos
   - Menor precisión en tablas complejas

3. **AWS Textract**
   - Especializado en tablas
   - Pricing por página

## 📞 Soporte

Para problemas o preguntas:
- Revisa los logs del backend: `npm run dev` en `/backend`
- Verifica la consola del navegador para errores del frontend
- Contacta al equipo de desarrollo

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0

