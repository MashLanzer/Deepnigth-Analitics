import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, BarChart2, AlertTriangle } from "lucide-react";

const videos = [
  {
    title: "Mensaje Inexplicable",
    type: "Short",
    views: "1.5K",
    status: "Viral",
    insight: "Alto engagement debido al misterio inmediato."
  },
  {
    title: "El Reflejo – Lo que vi en el espejo",
    type: "Short",
    views: "1.3K",
    status: "Exitoso",
    insight: "Título clickbait efectivo y temática relatable."
  },
  {
    title: "Señal 13: La Emisión Maldita",
    type: "Video",
    views: "14",
    status: "Bajo Rendimiento",
    insight: "Miniatura oscura y título poco claro. Necesita optimización."
  },
  {
    title: "El Misterio del Número Fantasma",
    type: "Short",
    views: "1.2K",
    status: "Exitoso",
    insight: "Buena retención en los primeros 5 segundos."
  }
];

export default function Content() {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono mb-2 glitch-text" data-text="ANÁLISIS DE CONTENIDO">ANÁLISIS DE CONTENIDO</h1>
        <p className="text-muted-foreground">Desglose de rendimiento por pieza de contenido.</p>
      </div>

      <div className="grid gap-4">
        {videos.map((video, index) => (
          <div 
            key={index}
            className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-border bg-card hover:border-primary/50 transition-all duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 bg-background flex items-center justify-center border border-border group-hover:border-primary/30">
              {video.type === "Short" ? (
                <PlayCircle className="w-6 h-6 text-primary" />
              ) : (
                <PlayCircle className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold truncate">{video.title}</h3>
                <Badge variant="outline" className={
                  video.type === "Short" 
                    ? "border-primary/30 text-primary bg-primary/5" 
                    : "border-border text-muted-foreground"
                }>
                  {video.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <BarChart2 className="w-3 h-3" />
                {video.views} visualizaciones
              </p>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
              <div className="flex-1 md:flex-none">
                <div className="text-xs font-mono text-muted-foreground mb-1">ESTADO</div>
                <div className={`text-sm font-bold ${
                  video.status === "Viral" || video.status === "Exitoso" ? "text-primary" : "text-destructive"
                }`}>
                  {video.status}
                </div>
              </div>
              
              <div className="flex-1 md:flex-none md:w-64">
                <div className="text-xs font-mono text-muted-foreground mb-1">INSIGHT</div>
                <div className="text-xs leading-tight flex items-start gap-1">
                  {video.status === "Bajo Rendimiento" && <AlertTriangle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />}
                  {video.insight}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
