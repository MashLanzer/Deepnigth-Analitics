import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Target, Zap, Clock, Users, TrendingUp, Award, Calendar, Loader } from "lucide-react";
import { useYouTubeChannel } from "@/hooks/useYouTube";
import { VideoMetrics } from "@/lib/analytics";
import { formatNumber } from "@/lib/utils";

const DEFAULT_CHANNEL_ID = "UCIlucAowvh8GUqsysgbpeMg";

const strategySections = [
  {
    title: "SHORTS BLITZ",
    icon: Zap,
    color: "primary",
    items: [
      { label: "Frecuencia Diaria", desc: "Publicar 1 Short cada día a las 18:00" },
      { label: "Gancho Visual", desc: "Hook en los primeros 0:01 segundos" },
      { label: "Loop Perfecto", desc: "El final conecta naturalmente con el inicio" },
      { label: "Audio Trending", desc: "Usa sonidos en tendencia (Dark Ambient)" }
    ]
  },
  {
    title: "RETENCIÓN (LONG FORM)",
    icon: Clock,
    color: "destructive",
    items: [
      { label: "00:00", desc: "El Gancho - Pregunta intrigante" },
      { label: "01:30", desc: "El Incidente Incitante - Primer giro" },
      { label: "05:00", desc: "El Clímax de Tensión - Momento crítico" },
      { label: "Cierre", desc: "Resolución con llamada a comentarios" }
    ]
  },
  {
    title: "COMUNIDAD",
    icon: Users,
    color: "secondary",
    items: [
      { label: "Interacción", desc: "Responder TODOS los comentarios en 1 hora" },
      { label: "Encuestas", desc: "Crear votaciones sobre próximos temas" },
      { label: "Favoritos", desc: "Dar corazón a comentarios creativos" },
      { label: "Transmisiones", desc: "1 stream semanal para conexión directa" }
    ]
  }
];

export default function Strategy() {
  const { stats, loading, error } = useYouTubeChannel(DEFAULT_CHANNEL_ID);
  
  const videos: VideoMetrics[] = stats?.videoPerformance || [];
  const channelInfo = stats?.channelInfo;
  
  // Calculate dynamic metrics from real data
  const avgEngagement = videos.length > 0
    ? videos.reduce((sum, v) => sum + (v.engagementRate || 0), 0) / videos.length
    : 0;
  
  const avgViews = videos.length > 0
    ? videos.reduce((sum, v) => sum + (v.views || 0), 0) / videos.length
    : 0;
  
  // Estimate upload frequency from recent videos (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentVideos = videos.filter(v => {
    if (!v.publishedAt) return false;
    return new Date(v.publishedAt) >= thirtyDaysAgo;
  });
  
  const uploadFrequency = recentVideos.length > 0 
    ? `${recentVideos.length} videos en 30 días`
    : "Sin datos recientes";
  
  // Current subscriber estimate (use actual if available, or estimate from views)
  const currentSubscribers = channelInfo?.subscribers || Math.round(avgViews * 0.02);
  const targetSubscribers = Math.max(currentSubscribers * 3, currentSubscribers + 10000);
  
  // Target engagement (aim for 2-3% improvement)
  const targetEngagement = Math.min(avgEngagement * 1.3, 15);
  
  // Dynamic roadmap based on current performance
  const roadmap = [
    { 
      week: "Semana 1-2", 
      goal: `Establecer rutina: ${uploadFrequency}`, 
      status: recentVideos.length > 2 ? "En Progreso" : "Planificado" 
    },
    { 
      week: "Semana 3-4", 
      goal: `Alcanzar ${formatNumber(Math.round(currentSubscribers * 1.5))} suscriptores`, 
      status: "En Progreso" 
    },
    { 
      week: "Mes 2", 
      goal: "Lanzar serie temática con 4 episodios", 
      status: "Planificado" 
    },
    { 
      week: "Mes 3", 
      goal: `Alcanzar ${formatNumber(targetSubscribers)} suscriptores`, 
      status: "Planificado" 
    }
  ];
  
  // Dynamic competitor metrics based on actual channel performance
  const shortsCount = videos.filter(v => (v.views || 0) > 500).length;
  const avgShortLength = "25-35s"; // Typical Short length
  
  const competitorMetrics = [
    { 
      name: "Frecuencia", 
      you: uploadFrequency, 
      competitors: "5-7/semana", 
      action: recentVideos.length < 3 ? "Aumentar a 1/día" : "Mantener ritmo" 
    },
    { 
      name: "Longitud (Shorts)", 
      you: avgShortLength, 
      competitors: "15-20s", 
      action: "Optimizar duración" 
    },
    { 
      name: "Engagement %", 
      you: `${avgEngagement.toFixed(1)}%`, 
      competitors: "8-12%", 
      action: avgEngagement < 6 ? "Mejorar hooks" : "Mantener calidad" 
    },
    { 
      name: "Cobertura de Temas", 
      you: `${shortsCount} Shorts`, 
      competitors: "Muy variados", 
      action: "Mantener especialidad" 
    }
  ];

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
        <h1 className="text-3xl font-bold font-mono mb-2 glitch-text" data-text="ESTRATEGIA OPERATIVA">ESTRATEGIA OPERATIVA</h1>
        <p className="text-muted-foreground">Plan de acción táctico basado en datos reales de tu canal. Objetivos claros para los próximos 30-90 días.</p>
      </div>

      {/* Strategy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {strategySections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 bg-${section.color}/10 border border-${section.color} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 text-${section.color}`} />
                </div>
                <h2 className="font-mono text-lg font-bold">{section.title}</h2>
              </div>
              
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="border border-border bg-card p-4 hover:border-primary/50 transition-colors group">
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{item.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Roadmap */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          ROADMAP - PRÓXIMOS 90 DÍAS
        </h2>
        <div className="space-y-3">
          {roadmap.map((item, idx) => (
            <div key={idx} className="border border-border bg-card p-4 flex items-center justify-between hover:border-primary/50 transition-colors">
              <div className="flex-1">
                <h3 className="font-bold font-mono text-sm">{item.week}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.goal}</p>
              </div>
              <div className={`px-3 py-1 text-xs font-mono border ${
                item.status === "En Progreso" 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-muted-foreground text-muted-foreground bg-muted/5"
              }`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competitive Analysis */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          ANÁLISIS COMPETITIVO
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left p-4 font-bold">Métrica</th>
                <th className="text-center p-4 font-bold">Tu Canal</th>
                <th className="text-center p-4 font-bold">Competidores</th>
                <th className="text-left p-4 font-bold">Acción</th>
              </tr>
            </thead>
            <tbody>
              {competitorMetrics.map((row, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-background/30 transition-colors">
                  <td className="p-4 font-bold">{row.name}</td>
                  <td className="text-center p-4 text-primary">{row.you}</td>
                  <td className="text-center p-4 text-muted-foreground">{row.competitors}</td>
                  <td className="p-4">
                    <span className="text-xs border border-destructive/30 text-destructive bg-destructive/5 px-2 py-1">
                      {row.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth KPIs */}
      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          OBJETIVOS DE CRECIMIENTO (PRÓXIMOS 3 MESES)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-primary/30 bg-primary/5 p-6">
            <h3 className="font-bold text-primary mb-4">Métrica Primaria</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">SUSCRIPTORES (ACTUAL → OBJETIVO)</div>
                <div className="text-3xl font-bold text-primary">{formatNumber(currentSubscribers)} → {formatNumber(targetSubscribers)}</div>
                <p className="text-xs text-muted-foreground mt-2">Triplicar base de seguidores mediante contenido consistente</p>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">ENGAGEMENT RATE (ACTUAL → OBJETIVO)</div>
                <div className="text-3xl font-bold text-primary">{avgEngagement.toFixed(1)}% → {targetEngagement.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground mt-2">Mejorar hooks y retención de audiencia</p>
              </div>
            </div>
          </div>

          <div className="border border-secondary/30 bg-secondary/5 p-6">
            <h3 className="font-bold text-secondary mb-4">Métrica Secundaria</h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">VISUALIZACIONES/MES</div>
                <div className="text-3xl font-bold text-secondary">{formatNumber(Math.round(avgViews * 10))} → {formatNumber(Math.round(avgViews * 50))}</div>
                <p className="text-xs text-muted-foreground mt-2">Aumentar alcance mediante publicación diaria</p>
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-1">FRECUENCIA</div>
                <div className="text-3xl font-bold text-secondary">{recentVideos.length}/mes → 30/mes</div>
                <p className="text-xs text-muted-foreground mt-2">1 Short diario + 2-3 videos largo por mes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="border border-border bg-card p-6">
        <h2 className="text-xl font-bold font-mono mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          ACCIONES INMEDIATAS (ESTA SEMANA)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="border border-primary/30 bg-primary/5 p-3 flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">{uploadFrequency.includes("Sin") ? "Publicar" : "Continuar publicando"} {uploadFrequency.includes("Sin") ? "tu primer Short" : "Shorts consistentemente"}</div>
            </div>
            <div className="border border-primary/30 bg-primary/5 p-3 flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">{avgEngagement < 6 ? "Revisar y mejorar hooks de videos" : "Mantener calidad actual de hooks"}</div>
            </div>
            <div className="border border-primary/30 bg-primary/5 p-3 flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">Responder a comentarios de últimos videos (prioritarios)</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border border-primary/30 bg-primary/5 p-3 flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">Planificar próximos {Math.max(3, Math.ceil(7 / Math.max(1, recentVideos.length)))} videos en base a temas trending</div>
            </div>
            <div className="border border-primary/30 bg-primary/5 p-3 flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">Crear encuesta: ¿Cuál será el próximo tema a explorar?</div>
            </div>
            <div className="border border-primary/30 bg-primary/5 p-3 flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">Programar {avgEngagement >= 6 ? "sesión de Q&A" : "livestream introductorio"}</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
