# Despliegue de Funcionalidad de Extracción de Especificaciones

## 🚀 Pasos para Despliegue en Producción

### 1. Preparación Backend

#### A. Verificar Dependencias
```bash
cd backend
npm install
```

Las siguientes dependencias ya están instaladas:
- `openai` - Cliente de OpenAI API
- `pdf-parse` - Procesamiento de PDFs
- `sharp` - Procesamiento de imágenes

#### B. Configurar Variables de Entorno en Vercel

1. **Acceder a Vercel Dashboard**
   - Ve a https://vercel.com/
   - Selecciona tu proyecto de backend

2. **Agregar Variable de Entorno**
   - Settings → Environment Variables
   - Agrega la siguiente variable:

   ```
   Name: OPENAI_API_KEY
   Value: sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Environments: Production, Preview (opcional)
   ```

3. **Guardar y Redeploy**
   - Haz clic en "Save"
   - Ve a Deployments
   - Haz clic en "Redeploy" en el último deployment

### 2. Preparación Frontend

El frontend ya está actualizado con:
- Componente `SpecificationExtractor`
- Página `AddMachinery` actualizada con tabs
- API service con endpoint de extracción

No requiere cambios adicionales.

### 3. Verificación Post-Deployment

#### A. Verificar Backend
```bash
# Test health endpoint
curl https://your-backend.vercel.app/health

# Expected response:
{
  "success": true,
  "message": "API de CompareMachine está funcionando",
  "timestamp": "...",
  "version": "1.0.0"
}
```

#### B. Verificar Endpoint de Extracción
```bash
# Con autenticación (reemplaza TOKEN con tu JWT)
curl -X POST https://your-backend.vercel.app/api/extraction/specifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/test-image.jpg"
```

#### C. Probar en Producción
1. Ve a https://compare-machine.vercel.app/add-machinery
2. Inicia sesión
3. Sube una imagen de especificaciones
4. Verifica que se extraigan correctamente

### 4. Monitoreo

#### A. Logs de Vercel
```bash
# Ver logs en tiempo real
vercel logs your-backend-deployment-url --follow
```

#### B. Logs de OpenAI
- Ve a https://platform.openai.com/usage
- Monitorea el uso de API y costos

### 5. Rollback (si es necesario)

Si encuentras problemas:

```bash
# Desde Vercel Dashboard
1. Ve a Deployments
2. Encuentra el deployment anterior estable
3. Haz clic en "..." → "Promote to Production"
```

## 📝 Checklist de Deployment

- [ ] Backend compilado exitosamente (`npm run build`)
- [ ] Dependencias instaladas en backend
- [ ] `OPENAI_API_KEY` configurada en Vercel
- [ ] Backend redeployado
- [ ] Frontend verificado (no requiere rebuild)
- [ ] Endpoint de extracción probado
- [ ] Funcionalidad probada end-to-end
- [ ] Documentación actualizada
- [ ] Equipo notificado

## 🔒 Seguridad

### Variables de Entorno Sensibles
- **NUNCA** commits `OPENAI_API_KEY` en Git
- Usa Vercel Environment Variables
- Rota la API key periódicamente

### Rate Limiting
El endpoint está protegido por:
- Autenticación JWT (requerida)
- Rate limiting global de Express
- Rate limiting de OpenAI (60 req/min típico)

## 💰 Costos Estimados

### OpenAI API (GPT-4o-mini)
- **Input**: $0.15 / 1M tokens
- **Output**: $0.60 / 1M tokens

### Por Extracción
- Imagen: ~$0.01 - $0.02
- PDF: ~$0.005 - $0.015

### Mensual (estimado)
- 100 extracciones/mes: ~$1.00 - $2.00 USD
- 500 extracciones/mes: ~$5.00 - $10.00 USD
- 1000 extracciones/mes: ~$10.00 - $20.00 USD

**Nota**: Vercel hosting es gratis en tier Hobby (límites aplican).

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY is not defined"
**Solución**: Verifica que la variable esté configurada en Vercel y que hayas redeployado.

### Error: "Rate limit exceeded"
**Solución**: OpenAI tiene límites de rate. Espera 1 minuto y reinténtalo.

### Error: "Insufficient quota"
**Solución**: Agrega créditos a tu cuenta de OpenAI.

### Extracción lenta
**Esperado**: 5-15 segundos por documento es normal.

### Frontend no se conecta al backend
**Solución**: Verifica CORS y que el `VITE_API_URL` apunte al backend correcto.

## 📊 Métricas a Monitorear

1. **Tasa de éxito de extracciones** (objetivo: >95%)
2. **Tiempo promedio de extracción** (objetivo: <10s)
3. **Costo por extracción** (objetivo: <$0.02)
4. **Uso mensual de OpenAI** (monitorear para evitar sorpresas)

## 🔄 Actualizaciones Futuras

### Mejoras Planificadas
- [ ] Cache de extracciones similares
- [ ] Procesamiento en batch
- [ ] Soporte para más formatos (Excel, CSV)
- [ ] Validación mejorada de datos extraídos
- [ ] Edición inline de datos extraídos antes de guardar

### Optimizaciones
- [ ] Usar GPT-3.5-turbo para PDFs simples (más barato)
- [ ] Comprimir imágenes antes de enviar
- [ ] Implementar retry logic con backoff

## 📞 Contacto

Para problemas durante el deployment:
- Revisar logs de Vercel
- Verificar consola del navegador
- Contactar al equipo de desarrollo

---

**Fecha**: Octubre 2025  
**Versión**: 1.0.0  
**Última actualización**: Deploy inicial

