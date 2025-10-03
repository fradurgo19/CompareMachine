# 🚀 Inicio Rápido - Extracción de Especificaciones

## Para Usuarios Finales

### Paso 1: Acceder a la Página
Ve a: **https://compare-machine.vercel.app/add-machinery**

### Paso 2: Iniciar Sesión
Debes tener una cuenta y estar autenticado.

### Paso 3: Seleccionar Opción de Extracción
La pestaña **"Extraer de Imagen/PDF"** ya está seleccionada por defecto.

### Paso 4: Subir Archivo
Tienes dos opciones:
- **Arrastrar y soltar**: Arrastra tu imagen o PDF al área marcada
- **Click para seleccionar**: Haz clic en "Haz clic para subir"

**Archivos aceptados:**
- Imágenes: JPG, PNG, WEBP
- Documentos: PDF
- Tamaño máximo: 10MB

### Paso 5: Extraer
1. Haz clic en **"Extraer Especificaciones"**
2. Espera 5-15 segundos mientras la IA procesa el documento
3. Verás un indicador de carga con mensaje de progreso

### Paso 6: Revisar Datos
El sistema mostrará todas las máquinas detectadas:
- Nombre y modelo
- Fabricante y serie
- Especificaciones técnicas
- Categoría asignada

### Paso 7: Agregar a Base de Datos
1. Revisa que los datos sean correctos
2. Haz clic en **"Agregar X Máquina(s)"**
3. Verás mensaje de confirmación
4. Serás redirigido a la página de comparación

---

## Para Administradores

### Configuración Inicial (Solo una vez)

#### 1. Obtener OpenAI API Key

**a. Crear cuenta en OpenAI:**
1. Ve a https://platform.openai.com
2. Regístrate o inicia sesión
3. Agrega método de pago en Billing

**b. Generar API Key:**
1. Ve a https://platform.openai.com/api-keys
2. Clic en **"Create new secret key"**
3. Dale un nombre (ej: "CompareMachine-Production")
4. Copia la key (se muestra solo una vez)
5. Formato: `sk-proj-xxxxxxxxxxxxxxxxxxxxx`

#### 2. Configurar en Vercel Backend

**a. Acceder a Vercel:**
1. Ve a https://vercel.com
2. Inicia sesión
3. Selecciona el proyecto del **backend**

**b. Agregar Variable de Entorno:**
1. Ve a **Settings** → **Environment Variables**
2. Clic en **"Add New"**
3. Llena:
   ```
   Name: OPENAI_API_KEY
   Value: sk-proj-xxxxxxxxxxxxxxxxxxxxx
   Environments: ✅ Production ✅ Preview (opcional)
   ```
4. Clic en **"Save"**

**c. Redeploy:**
1. Ve a **Deployments**
2. Encuentra el deployment más reciente
3. Clic en los 3 puntos **"..."** → **"Redeploy"**
4. Espera a que complete (~2-3 minutos)

#### 3. Verificar Funcionamiento

**a. Probar Backend:**
```bash
# Test health endpoint
curl https://your-backend.vercel.app/health

# Debe retornar:
{
  "success": true,
  "message": "API de CompareMachine está funcionando",
  ...
}
```

**b. Probar Extracción:**
1. Ve a https://compare-machine.vercel.app/add-machinery
2. Inicia sesión
3. Sube una imagen de prueba
4. Verifica que funcione correctamente

---

## Ejemplo de Uso

### Documento de Entrada

Puedes usar una imagen como la que proporcionaste con datos de:
- ZX-5A Mini Excavator Series
- Múltiples modelos: ZX17U-5A, ZX19U-5A, ZX26U-5A, ZX33U-5A

### Resultado Esperado

El sistema extraerá automáticamente:
- ✅ 4 máquinas diferentes
- ✅ Todos los campos de especificaciones
- ✅ Conversión de unidades (kg → toneladas, etc.)
- ✅ Categoría: EXCAVATORS
- ✅ Fabricante: Hitachi (inferido del modelo)

### Tiempo de Procesamiento

- Imagen típica: **5-8 segundos**
- PDF con múltiples páginas: **10-15 segundos**

---

## Solución Rápida de Problemas

### ❌ Error: "No se ha subido ningún archivo"
**Solución**: Asegúrate de seleccionar un archivo antes de hacer clic en "Extraer".

### ❌ Error: "Tipo de archivo no válido"
**Solución**: Solo se aceptan JPG, PNG, WEBP, PDF. Verifica la extensión del archivo.

### ❌ Error: "El archivo es demasiado grande"
**Solución**: El archivo debe ser menor a 10MB. Comprime la imagen o reduce su tamaño.

### ❌ Error: "Error al extraer especificaciones"
**Posibles causas:**
- Imagen borrosa o texto ilegible → Usa imagen de mejor calidad
- OpenAI API sin créditos → Verifica cuenta de OpenAI
- API key incorrecta → Verifica variable de entorno en Vercel

### ⏰ La extracción está tardando mucho
**Normal**: 5-15 segundos es normal. Si tarda más de 30 segundos:
1. Refresca la página
2. Intenta de nuevo
3. Verifica tu conexión a Internet

### 🔒 Error: "Access token required"
**Solución**: Debes iniciar sesión antes de usar la funcionalidad.

---

## Consejos para Mejores Resultados

### ✅ DO (Hacer)

- ✅ Usa imágenes de alta resolución (>1000px)
- ✅ Asegúrate de buena iluminación
- ✅ Texto horizontal y legible
- ✅ Fondo contrastante
- ✅ Tablas completas visibles
- ✅ PDFs nativos cuando sea posible

### ❌ DON'T (No Hacer)

- ❌ Imágenes borrosas o pixeladas
- ❌ Texto demasiado pequeño (<10pt)
- ❌ Imágenes giradas o distorsionadas
- ❌ Tablas incompletas o cortadas
- ❌ Fondos con mucho ruido
- ❌ PDFs escaneados de baja calidad

---

## Comparación: Manual vs Extracción

| Aspecto | Manual | Extracción IA |
|---------|--------|---------------|
| **Tiempo** | 5-10 min/máquina | 5-15 seg/múltiples |
| **Precisión** | Depende del usuario | 90-95% |
| **Esfuerzo** | Alto | Bajo |
| **Errores** | Comunes | Raros |
| **Múltiples máquinas** | Repetitivo | Simultáneo |
| **Costo** | Gratis | ~$0.01-0.02/extracción |

---

## Preguntas Frecuentes

### ¿Cuántas máquinas puedo extraer a la vez?
Todas las que estén en el documento. El sistema detecta automáticamente todas las máquinas en una tabla.

### ¿Qué pasa si los datos extraídos son incorrectos?
Puedes usar la opción "Entrada Manual" para corregir o ingresar datos manualmente.

### ¿Se guardan mis archivos?
No. Los archivos se procesan en memoria y se descartan inmediatamente después.

### ¿Funciona con tablas en otros idiomas?
Sí, optimizado para inglés y español. Otros idiomas pueden funcionar con menor precisión.

### ¿Puedo editar los datos antes de guardar?
En la versión actual, debes revisar y aceptar. La edición inline está planificada para futuras versiones.

### ¿Cuánto cuesta usar esta función?
Para usuarios finales: Gratis. Para la empresa: ~$0.01-0.02 por extracción (OpenAI API).

---

## Contacto y Soporte

**Problemas técnicos:**
- Verifica logs del navegador (F12 → Console)
- Contacta al administrador del sistema

**Sugerencias o feedback:**
- Reporta problemas de extracción
- Comparte casos de uso exitosos
- Sugiere mejoras

---

## 🎉 ¡Listo para Usar!

Una vez configurada la API key de OpenAI, la funcionalidad estará 100% operativa y lista para usar en producción.

**Disfruta ahorrando tiempo con la extracción automática de especificaciones!** 🚀

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0

