import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { VideoMetrics, ChannelMetrics } from '@/lib/analytics';

interface ChannelHealthProps {
  metrics: ChannelMetrics;
  videos: VideoMetrics[];
}

interface HealthMetric {
  label: string;
  score: number;
  max: number;
  status: 'good' | 'warning' | 'critical';
  message: string;
}

export default function ChannelHealth({ metrics, videos }: ChannelHealthProps) {
  const calculateHealthMetrics = (): { metrics: HealthMetric[]; recentCount: number } => {
    const metrics_array: HealthMetric[] = [];

    // 1. Engagement Rate Check (target: > 3%)
    const engagementScore = Math.min(metrics.avgEngagementRate, 10);
    metrics_array.push({
      label: 'Engagement Rate',
      score: engagementScore,
      max: 10,
      status: metrics.avgEngagementRate > 5 ? 'good' : metrics.avgEngagementRate > 2 ? 'warning' : 'critical',
      message:
        metrics.avgEngagementRate > 5
          ? 'Excelente tasa de engagement'
          : metrics.avgEngagementRate > 2
            ? 'Engagement moderado, hay espacio para mejorar'
            : 'Engagement bajo, revisa tus titles y descriptions',
    });

    // 2. Video Consistency (check if has recent videos)
    const recentVideos = videos.filter((v) => {
      if (!v.publishedAt) return false;
      const pubDate = new Date(v.publishedAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - pubDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });

    const consistency = Math.min((recentVideos.length / Math.max(videos.length, 1)) * 100, 10);
    metrics_array.push({
      label: 'Frecuencia de Publicación',
      score: consistency,
      max: 10,
      status: recentVideos.length > 2 ? 'good' : recentVideos.length > 0 ? 'warning' : 'critical',
      message:
        recentVideos.length > 2
          ? `${recentVideos.length} videos publicados recientemente`
          : recentVideos.length > 0
            ? 'Bajo volumen de publicaciones recientes'
            : 'No hay videos recientes en el último mes',
    });

    // 3. Content Variety (check engagement variation)
    const engagements = videos.map((v) => v.engagementRate || 0);
    const avgEngagement = engagements.reduce((a, b) => a + b, 0) / Math.max(engagements.length, 1);
    const variance = Math.sqrt(
      engagements.reduce((sum, e) => sum + Math.pow(e - avgEngagement, 2), 0) / Math.max(engagements.length, 1)
    );

    const varietyScore = Math.min(variance * 2, 10);
    metrics_array.push({
      label: 'Variedad de Contenido',
      score: varietyScore,
      max: 10,
      status: variance > 2 ? 'good' : variance > 0.5 ? 'warning' : 'critical',
      message:
        variance > 2
          ? 'Buen mix de contenido con engagement variable'
          : variance > 0.5
            ? 'Contenido relativamente consistente'
            : 'El engagement es muy similar en todos los videos',
    });

    // 4. Subscriber Growth Potential
    const avgViewsPerVideo = metrics.avgViewsPerVideo || 0;
    const conversionPotential = Math.min((metrics.subscribers / Math.max(avgViewsPerVideo, 1)) * 10, 10);
    metrics_array.push({
      label: 'Potencial de Crecimiento',
      score: conversionPotential,
      max: 10,
      status: conversionPotential > 5 ? 'good' : conversionPotential > 2 ? 'warning' : 'critical',
      message:
        conversionPotential > 5
          ? 'Buena tasa de conversión vistas-suscriptores'
          : conversionPotential > 2
            ? 'Hay margen para mejorar la conversión'
            : 'Enfócate en mejorar CTR de suscripción',
    });

    return { metrics: metrics_array, recentCount: recentVideos.length };
  };

  const { metrics: healthMetrics, recentCount } = calculateHealthMetrics();
  const overallScore = (healthMetrics.reduce((sum, m) => sum + (m.score / m.max) * 100, 0) / healthMetrics.length).toFixed(0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="border border-border bg-card p-6 rounded">
      <h3 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary" />
        REPORTE DE SALUD DEL CANAL
      </h3>

      {/* Overall Score */}
      <div className="mb-8 p-6 border-2 border-primary/30 bg-primary/5 rounded">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-mono text-muted-foreground">PUNTUACIÓN GENERAL</p>
          <p className="text-4xl font-bold font-mono text-primary">{overallScore}%</p>
        </div>
        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-green-500 transition-all duration-500"
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {/* Individual Metrics */}
      <div className="space-y-4">
        {healthMetrics.map((metric, idx) => (
          <div key={idx} className="border border-border/50 rounded p-4 hover:bg-muted/20 transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getStatusIcon(metric.status)}
                <span className="text-sm font-mono font-semibold">{metric.label}</span>
              </div>
              <span className="text-sm font-mono font-bold text-primary">
                {metric.score.toFixed(1)}/{metric.max}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-border rounded-full h-1.5 overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-500 ${
                  metric.status === 'good'
                    ? 'bg-green-500'
                    : metric.status === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${(metric.score / metric.max) * 100}%` }}
              />
            </div>

            {/* Message */}
            <p className="text-xs text-muted-foreground font-mono">{metric.message}</p>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs font-mono text-muted-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          RECOMENDACIONES
        </p>
        <ul className="space-y-2">
          {metrics.avgEngagementRate < 3 && (
            <li className="text-xs text-muted-foreground font-mono">
              • Mejora tus títulos: incluye palabras clave y emoción
            </li>
          )}
          {recentCount < 2 && (
            <li className="text-xs text-muted-foreground font-mono">
              • Publica más frecuentemente (al menos 2/mes recomendado)
            </li>
          )}
          {metrics.avgEngagementRate > 0 && (
            <li className="text-xs text-muted-foreground font-mono">
              • Analiza tus videos top y replica su formato
            </li>
          )}
          <li className="text-xs text-muted-foreground font-mono">
            • Fomenta comentarios con calls-to-action en descripción
          </li>
        </ul>
      </div>
    </div>
  );
}
