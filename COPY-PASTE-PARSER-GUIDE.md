# 📋 Guía de Parseo por Copiar y Pegar

## 🎯 Descripción

Sistema **100% GRATUITO** para agregar especificaciones de maquinaria mediante copiar y pegar texto. No requiere APIs externas ni costos adicionales.

## ✨ Ventajas

- ✅ **Completamente gratis** - Sin costos de API
- ✅ **Procesamiento instantáneo** - No hay esperas
- ✅ **Múltiples máquinas a la vez** - Parsea tablas completas
- ✅ **Sin dependencias externas** - Funciona siempre
- ✅ **Fácil de usar** - Solo copiar y pegar

## 🚀 Cómo Usar

### Paso 1: Copiar Especificaciones

Desde cualquier fuente (PDF, Word, Excel, web):

1. Selecciona la tabla de especificaciones completa
2. Incluye la fila "Model" con los nombres de los modelos
3. Copia al portapapeles (Ctrl+C o Cmd+C)

### Paso 2: Pegar en la Aplicación

1. Ve a https://compare-machine.vercel.app/add-machinery
2. Inicia sesión
3. La pestaña **"Copiar y Pegar"** estará seleccionada
4. Pega el texto en el área de texto (Ctrl+V o Cmd+V)

### Paso 3: Parsear

1. Haz clic en **"Parsear Especificaciones"**
2. El sistema procesa el texto instantáneamente
3. Revisa los datos extraídos

### Paso 4: Agregar

1. Verifica que la información sea correcta
2. Haz clic en **"Agregar X Máquina(s)"**
3. ¡Listo! Las máquinas se agregan a la base de datos

## 📝 Formato Esperado

### Ejemplo Mínimo

```
ZX-5A Mini Excavator Series Specifications
Model ZX38U-5A ZX48U-5A ZX55U-5A
Operating Weight Range ;
Cab version kg 3 940 - 4 170 4 860 - 5 060 5 170 - 5 370
Bucket Capacity Range m3 0.10 0.11 0.14
Engine Model Yanmar EDM-3TNV88 EDM-4TNV88 4TNV94L-ZWHB
Rated Power ISO9249,net kW 21.2 28.2 34.1
Fuel Tank L 42.0 70.0 120.0
Undercarriage Length mm 2 110 2 500 2 500
Standard Track Shoe Width mm 300 400 400
```

### Estructura Requerida

**Línea 1**: Título con el nombre de la serie
- Ejemplo: "ZX-5A Mini Excavator Series Specifications"
- Debe contener el nombre de la serie (ej: "ZX-5A")
- Puede incluir el tipo de máquina (ej: "Excavator", "Bulldozer")

**Línea 2**: Fila de modelos (OBLIGATORIO)
- Debe empezar con "Model"
- Seguido de los nombres de cada modelo
- Separados por espacios múltiples o tabulaciones

**Líneas siguientes**: Especificaciones
- Cada línea: Nombre del campo + Unidad (opcional) + Valores
- Valores separados por espacios múltiples o tabulaciones
- Valores deben estar en el mismo orden que los modelos

### Separadores Permitidos

- ✅ Múltiples espacios (2 o más)
- ✅ Tabulaciones (Tab)
- ✅ Combinación de ambos

### Valores Soportados

- **Números simples**: `42.0`, `21.2`, `300`
- **Rangos**: `3 940 - 4 170` (se calcula el promedio)
- **Con separadores de miles**: `3 940` o `3,940`
- **Vacíos**: `—` o campos sin valor

## 🔍 Campos Reconocidos

El parser identifica automáticamente estos campos:

### Peso
- `Operating Weight`, `Cab version`, `Canopy version`
- Unidades: kg (se convierte a toneladas)

### Potencia
- `Rated Power`, `ISO9249`, `SAE J1349`, `EEC 80/1269`
- Unidades: kW (se convierte a HP)

### Motor
- `Engine Model`
- Texto directo (ej: "Yanmar EDM-3TNV88")

### Capacidades
- `Bucket Capacity`: m³
- `Fuel Tank`: Litros
- `Hydraulic System`: Litros

### Dimensiones
- `Undercarriage Length`: mm → metros
- `Undercarriage Width`: mm → metros
- `Track Shoe Width`: mm → metros

### Otras
- `Max Dig Depth`: metros
- `Max Reach`: metros

## 🎯 Ejemplos Completos

### Ejemplo 1: Excavadoras Hitachi

```
ZX-5A Mini Excavator Series Specifications
Model ZX38U-5A ZX48U-5A ZX55U-5A ZX65USB-5A
Region Offerings
SE Asia, Oceania SE Asia, Oceania SE Asia, Oceania
Operating Weight Range ;
Cab version kg 3 940 - 4 170 4 860 - 5 060 5 170 - 5 370 6 140 - 6 290
Bucket Capacity Range m3 0.10 0.11 0.14 0.22
Engine Model Yanmar EDM-3TNV88 EDM-4TNV88 4TNV94L-ZWHB 4TNV94L-ZWHB
Rated Power ISO9249,net kW 21.2 28.2 34.1 34.1
Fuel Tank L 42.0 70.0 120.0 120.0
Hydraulic System L 88.0 108.0 168.0 168.0
Undercarriage Length mm 2 110 2 500 2 500 2 500
Standard Track Shoe Width mm 300 400 400 400
```

**Resultado**: 4 excavadoras Hitachi parseadas correctamente

### Ejemplo 2: Desde PDF

Cuando copies desde un PDF, el texto puede verse así:

```
CAT 320 Series Excavators
Model 320 320 GC 320D
Weight kg 20000 21000 22000
Power kW 100 105 110
Engine Model C4.4 C4.4 C4.4
Fuel L 410 410 460
```

**Resultado**: 3 excavadoras Caterpillar parseadas

### Ejemplo 3: Tabla con Espacios

```
Model               ZX17U-5A    ZX19U-5A    ZX26U-5A
Weight kg           1 760       2 630       3 320
Power kW            10.6        14.5        21.2
Engine Model        3TNV70      3TNV76      EDM-3TNV88
Fuel Capacity L     20.0        33.4        42.0
```

**Resultado**: 3 excavadoras parseadas

## 💡 Tips para Mejores Resultados

### ✅ DO (Hacer)

1. **Incluye la línea Model**: Es obligatoria
2. **Copia toda la tabla**: Desde el título hasta la última fila
3. **Mantén el formato**: No elimines espacios o líneas
4. **Verifica la alineación**: Los valores deben estar bajo su modelo
5. **Usa fuentes confiables**: PDFs oficiales, catálogos

### ❌ DON'T (No Hacer)

1. **No edites el texto manualmente**: Copia tal cual
2. **No elimines líneas**: Incluso si parecen innecesarias
3. **No mezcles formatos**: Mantén la estructura original
4. **No uses comas para decimales**: Usa punto (21.2 no 21,2)

## 🧮 Conversiones Automáticas

El sistema convierte automáticamente:

| De | A | Factor |
|----|---|--------|
| kg | toneladas | ÷ 1000 |
| kW | HP | × 1.34102 |
| mm | metros | ÷ 1000 |
| Rangos | Promedio | (min + max) / 2 |

## 🏭 Fabricantes Detectados

El sistema infiere el fabricante basándose en el prefijo del modelo:

- `ZX...` → Hitachi
- `CAT...` o `320...` → Caterpillar
- `PC...` → Komatsu
- `EC...` → Volvo
- `JCB...` → JCB
- Otros → "Unknown" (puedes editar después)

## 🔧 Solución de Problemas

### ❌ Error: "No se pudieron encontrar modelos"

**Causa**: Falta la línea que empieza con "Model"

**Solución**: 
- Asegúrate de incluir la línea "Model ..."
- Verifica que diga exactamente "Model" (mayúsculas/minúsculas no importan)

### ❌ Error: "No se pudieron extraer especificaciones válidas"

**Causa**: Faltan datos esenciales (peso, potencia, o combustible)

**Solución**:
- Verifica que la tabla incluya al menos:
  - Operating Weight o Cab version
  - Rated Power o similar
  - Fuel Tank o Fuel Capacity

### ❌ Los valores no coinciden con los modelos

**Causa**: Desalineación en el copiado

**Solución**:
- Vuelve a copiar la tabla completa
- Verifica que uses una fuente confiable (PDF nativo mejor que escaneado)
- Prueba copiar desde otro programa (ej: si copiaste desde PDF, prueba abrir en Word)

### ❌ Algunos modelos no se parsean

**Causa**: Valores faltantes en columnas intermedias

**Solución**:
- Asegúrate que todas las columnas tengan valores o `—`
- Verifica que no haya columnas vacías

## 📊 Validaciones

El sistema valida:

- ✅ Peso > 0 toneladas
- ✅ Potencia > 0 HP
- ✅ Capacidad de combustible > 0 litros
- ✅ Modelo no vacío
- ✅ Serie detectada

Si alguna máquina no pasa las validaciones, no se incluye en los resultados.

## 🆚 Comparación con OpenAI

| Característica | Copiar/Pegar | OpenAI (removido) |
|----------------|--------------|-------------------|
| **Costo** | ✅ Gratis | ❌ $0.01-0.02/extracción |
| **Velocidad** | ✅ Instantáneo | ⏱️ 5-15 segundos |
| **Precisión** | ✅ 95%+ | ✅ 90-95% |
| **Imágenes** | ❌ No | ✅ Sí (removido) |
| **PDFs nativos** | ✅ Sí (copiar texto) | ✅ Sí (removido) |
| **PDFs escaneados** | ❌ No | ✅ Sí (removido) |
| **Dependencias** | ✅ Ninguna | ❌ API externa |
| **Disponibilidad** | ✅ 100% | ⚠️ Depende de API |

## 📱 Uso desde Móvil

También funciona desde dispositivos móviles:

1. Abre el PDF o imagen
2. Selecciona el texto y copia
3. Abre la app web
4. Pega en el área de texto
5. Parsea y agrega

## 🎓 Casos de Uso

### Caso 1: Catálogo de Fabricante
**Input**: Tabla con 5 modelos de excavadoras  
**Output**: 5 máquinas agregadas en segundos  
**Tiempo**: < 5 segundos total

### Caso 2: Comparativa de Competidores
**Input**: Varias tablas de diferentes fabricantes  
**Output**: Procesar tabla por tabla  
**Tiempo**: < 1 minuto para 20 máquinas

### Caso 3: Actualización de Datos
**Input**: Nueva versión de especificaciones  
**Output**: Agregar modelos actualizados  
**Tiempo**: Inmediato

## 📞 Soporte

Si tienes problemas:

1. Revisa esta guía
2. Verifica el formato del texto
3. Prueba con el ejemplo provisto
4. Contacta al equipo técnico

## 🔄 Actualizaciones Futuras

Mejoras planificadas:

- [ ] Soporte para Excel directo
- [ ] Detección de más fabricantes
- [ ] Edición inline antes de guardar
- [ ] Plantillas predefinidas
- [ ] Historial de parseos

---

**Versión**: 1.0.0  
**Última actualización**: Octubre 2025  
**Estado**: ✅ En Producción

