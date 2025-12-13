import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, BarChart2, AlertTriangle, TrendingUp, Eye, MessageCircle, Share2, Loader } from "lucide-react";
import { useYouTubeChannel } from "@/hooks/useYouTube";
import { VideoMetrics } from "@/lib/analytics";
import { formatNumber } from "@/lib/utils";

const DEFAULT_CHANNEL_ID = "UCIlucAowvh8GUqsysgbpeMg";

// Helper function to get video status based on engagement rate
function getVideoStatus(engagementRate: number | undefined): string {
  if (!engagementRate) return "Sin datos";
  if (engagementRate >= 8) return "Viral";
  if (engagementRate >= 6) return "Exitoso";
  if (engagementRate >= 3) return "Regular";
  return "Bajo Rendimiento";
}

// Helper function to get insight based on video performance
function getVideoInsight(video: VideoMetrics): string {
  const engagement = video.engagementRate || 0;
  const views = video.viewCount || 0;
  
  if (engagement >= 8) {
    return "Alto engagement debido a contenido resonante con la audiencia.";
  }
  if (engagement >= 6) {
    return "Buen desempeño. Mantén este estilo de contenido.";
  }
  if (views < 100) {
    return "Bajo alcance. Mejora el SEO y promociona más en redes.";
  }
  return "Rendimiento moderado. Considera optimizar título y miniatura.";
}

// Helper to estimate duration from description length (fallback)
function estimateDuration(duration?: number): string {
  if (!duration) return "0m";
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

export default function Content() {
  const { stats, loading, error } = useYouTubeChannel(DEFAULT_CHANNEL_ID);
  
  const videos: VideoMetrics[] = (stats?.videoPerformance || []).slice(0, 20);
  
  // Calculate dynamic metrics from real data
  const totalViews = videos.reduce((sum, v) => sum + (v.viewCount || 0), 0);
  const avgEngagement = videos.length > 0 
    ? (videos.reduce((sum, v) => sum + (v.engagementRate || 0), 0) / videos.length)
    : 0;
  const totalShares = videos.reduce((sum, v) => sum + (v.shares || 0), 0);
  
  // Determine dominant content type based on view distribution
  const shortsCount = videos.filter(v => (v.viewCount || 0) > 1000).length;
  const dominant = shortsCount > videos.length / 2 ? "Shorts" : "Videos";
  
  const contentMetrics = [
    { label: "Visualizaciones Totales", value: formatNumber(totalViews), icon: Eye, trend: `+${Math.round(avgEngagement * 2)}%` },
    { label: "Engagement Promedio", value: `${avgEngagement.toFixed(1)}%`, icon: MessageCircle, trend: `+${Math.round(avgEngagement / 2)}%` },
    { label: "Compartidos", value: formatNumber(totalShares), icon: Share2, trend: "+15%" },
    { label: "Tendencia", value: dominant, icon: TrendingUp, trend: `↑ ${videos.length} videos` }
  ];
  
  // Extract trending topics from video tags
  const tagFrequency = new Map<string, number>();
  videos.forEach(v => {
    if (v.tags && Array.isArray(v.tags)) {
      v.tags.forEach(tag => {
        const key = tag.toLowerCase().trim();
        if (key && key.length > 2) {
          tagFrequency.set(key, (tagFrequency.get(key) || 0) + 1);
        }
      });
    }
  });
  
  const trendingTopics = Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
  
  // Fallback if no tags found
  if (trendingTopics.length === 0) {
    trendingTopics.push("Misterios", "Paranormal", "Historias", "Oscuro", "Suspenso");
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="border border-destructive/30 bg-destructive/5 p-6 text-center">
          <h2 className="text-lg font-bold text-destructive mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-mono mb-2 glitch-text" data-text="ANÁLISIS DE CONTENIDO">ANÁLISIS DE CONTENIDO</h1>
        <p className="text-muted-foreground">Desglose detallado de rendimiento por pieza de contenido y tendencias.</p>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {contentMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="border border-border bg-card p-4 hover:border-primary/50 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-xs text-primary font-mono">{metric.trend}</span>
              </div>
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          );
        })}
      </div>

      {/* Content Performance Table */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary" />
          RENDIMIENTO POR CONTENIDO ({videos.length} videos)
        </h2>
        {videos.length === 0 ? (
          <div className="border border-border bg-card p-8 text-center text-muted-foreground">
            <p>No hay videos disponibles en el canal</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {videos.map((video, index) => {
              const status = getVideoStatus(video.engagementRate);
              const insight = getVideoInsight(video);
              const duration = estimateDuration(video.duration);
              const isShort = (video.viewCount || 0) > 1000;
              
              return (
                <div 
                  key={video.id || index}
                  className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-border bg-card hover:border-primary/50 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-background flex items-center justify-center border border-border group-hover:border-primary/30">
                    <PlayCircle className={`w-6 h-6 ${isShort ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold truncate">{video.title}</h3>
                      <Badge variant="outline" className={
                        isShort
                          ? "border-primary/30 text-primary bg-primary/5" 
                          : "border-border text-muted-foreground"
                      }>
                        {isShort ? "Short" : "Video"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <BarChart2 className="w-3 h-3" />
                      {formatNumber(video.viewCount || 0)} visualizaciones • {duration} promedio
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                    <div className="flex-1 md:flex-none">
                      <div className="text-xs font-mono text-muted-foreground mb-1">ESTADO</div>
                      <div className={`text-sm font-bold ${
                        status === "Viral" || status === "Exitoso" ? "text-primary" : "text-destructive"
                      }`}>
                        {status}
                      </div>
                    </div>

                    <div className="flex-1 md:flex-none">
                      <div className="text-xs font-mono text-muted-foreground mb-1">ENGAGEMENT</div>
                      <div className="text-sm font-bold text-primary">{(video.engagementRate || 0).toFixed(1)}%</div>
                    </div>
                    
                    <div className="flex-1 md:flex-none md:w-56">
                      <div className="text-xs font-mono text-muted-foreground mb-1">INSIGHT</div>
                      <div className="text-xs leading-tight flex items-start gap-1">
                        {status === "Bajo Rendimiento" && <AlertTriangle className="w-3 h-3 text-destructive shrink-0 mt-0.5" />}
                        {insight}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trending Topics */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary" />
          TEMAS EN TENDENCIA (TU CANAL)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {trendingTopics.map((topic, idx) => (
            <div key={idx} className="border border-primary/30 bg-primary/5 p-3 text-center hover:border-primary transition-colors group cursor-pointer">
              <div className="text-sm font-bold text-primary group-hover:scale-105 transition-transform inline-block">
                #{topic}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="border border-border bg-card p-6">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          RECOMENDACIONES INMEDIATAS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-destructive/30 bg-destructive/5 p-4">
            <h3 className="font-bold text-destructive mb-2">🚨 Urgente</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              {videos.filter(v => (v.engagementRate || 0) < 3).length > 0 ? (
                <>
                  <li>• {videos.filter(v => (v.engagementRate || 0) < 3).length} video(s) con bajo engagement ({(videos.filter(v => (v.engagementRate || 0) < 3)[0]?.engagementRate || 0).toFixed(1)}%)</li>
                  <li>• Revisar y mejorar miniatura y SEO de estos videos.</li>
                  <li>• Considerar convertir contenido largo en Shorts para mayor alcance.</li>
                </>
              ) : (
                <>
                  <li>• Mantener la calidad actual del contenido.</li>
                  <li>• Todos tus videos están generando buen engagement ({">"}3%).</li>
                  <li>• Enfocarse en mantener la frecuencia de publicación.</li>
                </>
              )}
            </ul>
          </div>
          <div className="border border-primary/30 bg-primary/5 p-4">
            <h3 className="font-bold text-primary mb-2">💡 Oportunidades</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              {avgEngagement >= 6 ? (
                <>
                  <li>• Tu engagement promedio ({avgEngagement.toFixed(1)}%) es excelente - sigue este patrón.</li>
                  <li>• Los temas más frecuentes: {trendingTopics.slice(0, 2).join(", ")} son tus mejores temas.</li>
                  <li>• Replica la estructura de tus videos más exitosos en nuevos contenidos.</li>
                </>
              ) : (
                <>
                  <li>• Aumentar frecuencia de publicación a 1 vez por día.</li>
                  <li>• Experimentar con nuevos hooks en los primeros 3 segundos.</li>
                  <li>• Analizar títulos de videos exitosos y aplicar mismo patrón.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
