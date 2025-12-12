# YouTube Analytics Dashboard - Mejoras Implementadas

## Nuevas Características

### 1. **Integración con API de YouTube**
- Conexión en tiempo real con datos reales de YouTube
- Obtención automática de información del canal
- Análisis de videos más populares

### 2. **Búsqueda de Canales**
- Campo para ingresar el ID del canal de YouTube
- Validación de entrada
- Carga automática de datos

### 3. **Métricas Dinámicas**
- Suscriptores en tiempo real
- Total de visualizaciones
- Cantidad de videos
- Información del canal

### 4. **Galería de Videos**
- Grid responsivo de videos del canal
- Visualización de estadísticas por video
- Enlaces directos a YouTube
- Duración de videos en ISO 8601

### 5. **Gráfico de Crecimiento**
- Proyección basada en datos reales
- Estadísticas diarias de visualizaciones

## Configuración

### Paso 1: Obtener API Key de YouTube

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto
3. Activa la "YouTube Data API v3"
4. Crea una credencial de tipo "API Key"
5. Copia la API key

### Paso 2: Configurar el Archivo .env

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Luego reemplaza `AIzaSyA_YOUR_API_KEY_HERE` con tu API key real:

```
YOUTUBE_API_KEY=AIzaSyA_tu_api_key_aqui
NODE_ENV=development
PORT=3000
```

### Paso 3: Instalar Dependencias

```bash
npm install --legacy-peer-deps
```

### Paso 4: Ejecutar en Desarrollo

```bash
npm run dev
```

### Paso 5: Encontrar el ID del Canal

El ID del canal está en la URL de YouTube:
```
https://youtube.com/channel/AQUI_ESTA_EL_ID
```

## Estructura de Archivos

```
client/src/
├── services/
│   └── youtubeService.ts      # Cliente para API de YouTube
├── hooks/
│   └── useYouTube.ts           # Hooks personalizados para datos
├── components/
│   ├── ChannelSearch.tsx       # Componente de búsqueda
│   ├── VideoGrid.tsx           # Galería de videos
│   └── ...
└── pages/
    └── Home.tsx                # Página principal mejorada

server/
├── services/
│   └── youtubeService.ts       # Servicio backend de YouTube
├── routes/
│   └── youtube.ts              # Rutas de API
└── index.ts                    # Servidor Express
```

## Endpoints de API

### GET `/api/youtube/channel-stats`
Obtiene estadísticas completas del canal.

**Parámetros:**
- `channelId` (required): ID del canal de YouTube

**Respuesta:**
```json
{
  "channelInfo": { ... },
  "videoPerformance": [ ... ],
  "dailyViews": [ ... ]
}
```

### GET `/api/youtube/channel-info`
Obtiene información básica del canal.

**Parámetros:**
- `channelId` (required): ID del canal de YouTube

### GET `/api/youtube/top-videos`
Obtiene los videos más populares del canal.

**Parámetros:**
- `channelId` (required): ID del canal de YouTube
- `limit` (optional): Número máximo de videos (default: 10)

## Limitaciones y Cuotas

- YouTube Data API tiene límites de cuota diaria
- Cada solicitud consume ciertos puntos de cuota
- Los límites se reinician a las 12:00 AM PT (Hora del Pacífico)

## Mejoras Futuras

- [ ] Gráficos más avanzados con comparativas
- [ ] Análisis de tendencias a largo plazo
- [ ] Recomendaciones basadas en IA
- [ ] Exportación de reportes en PDF
- [ ] Seguimiento de múltiples canales
- [ ] Análisis de comentarios
- [ ] Predicciones de crecimiento

## Troubleshooting

### Error: "YouTube API key is not set"
- Verifica que hayas creado el archivo `.env`
- Asegúrate de que la API key esté correctamente configurada
- Reinicia el servidor

### Error: "Channel not found"
- Verifica que el ID del canal sea correcto
- El formato debe ser exactamente como aparece en la URL
- No incluyas "/channel/" en el ID

### Error: "API quota exceeded"
- Has superado el límite de cuota diaria
- Intenta nuevamente después de las 12:00 AM PT
- Considera solicitar un aumento de cuota a Google

## Licencia

MIT
