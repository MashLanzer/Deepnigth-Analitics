import Layout from "@/components/Layout";
import { Streamdown } from "streamdown";

const reportContent = `
# Informe de Inteligencia: deepnight_stories

## 1. Resumen Ejecutivo

El canal de YouTube **deepnight_stories** presenta una base sólida con un nicho claramente definido en el género de terror y misterio en español. A pesar de ser un canal relativamente nuevo, con 41 suscriptores y 9 videos, muestra un gran potencial, especialmente en el formato de YouTube Shorts, donde ha logrado un rendimiento significativamente superior en comparación con los videos de formato largo.

## 2. Análisis de Datos

| Métrica Clave | Dato | Observación |
| :--- | :--- | :--- |
| **Nombre del Canal** | deepnight_stories | Profesional y alineado con el nicho. |
| **Suscriptores** | 41 | Base inicial pequeña, con alto potencial de crecimiento. |
| **Videos Publicados** | 9 | Contenido limitado, se necesita mayor frecuencia. |
| **Branding** | Consistente | El banner y el logo reflejan la temática de terror. |

## 3. Análisis Comparativo: Videos vs. Shorts

Se observa una disparidad muy marcada en el rendimiento de los videos largos frente a los YouTube Shorts. Mientras que los videos largos luchan por obtener visualizaciones, los Shorts han demostrado ser un motor de descubrimiento y alcance para el canal.

*   **Video Largo Más Reciente:** 14 visualizaciones (Bajo Rendimiento)
*   **Short Más Exitoso:** 1.5K visualizaciones (Alto Rendimiento)

**Conclusión:** La audiencia actual del canal, y el algoritmo de YouTube, favorecen claramente el formato de Shorts.

## 4. Recomendaciones Tácticas

### 4.1. Optimización de Miniaturas (Thumbnails)

*   **Alto Contraste:** Utiliza colores que resalten (Rojo, Blanco, Negro).
*   **Rostros:** Las miniaturas con rostros expresivos tienen mayor CTR.
*   **Texto Mínimo:** Máximo 3 palabras, fuente grande y legible.

### 4.2. Expansión a Podcast

El formato de historias de terror es ideal para el podcasting. Puedes reutilizar el audio de tus videos de YouTube para crear un podcast y publicarlo en plataformas como Spotify.

### 4.3. Engagement

*   Responder a todos los comentarios.
*   Usar la pestaña de Comunidad para encuestas.
*   Incluir CTAs claros al final de los videos.
`;

export default function Report() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 border-b border-border pb-4">
          <h1 className="text-3xl font-bold font-mono mb-2 glitch-text" data-text="INFORME CLASIFICADO">INFORME CLASIFICADO</h1>
          <p className="text-muted-foreground font-mono text-xs">DOC_ID: DNS-2025-X99 // NIVEL DE ACCESO: AUTORIZADO</p>
        </div>
        
        <div className="prose prose-invert prose-green max-w-none">
          <Streamdown>{reportContent}</Streamdown>
        </div>
      </div>
    </Layout>
  );
}
