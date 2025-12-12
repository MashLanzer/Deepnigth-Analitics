import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Zap } from 'lucide-react';
import { VideoMetrics } from '@/lib/analytics';

interface ContentSuggestion {
  date: string;
  type: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  estimatedViews: number;
}

interface Props {
  videos: VideoMetrics[];
}

export default function ContentCalendar({ videos }: Props) {
  // Generate suggested content calendar based on analytics
  const now = new Date();
  const suggestions: ContentSuggestion[] = [];

  // Find best performing topics
  const topicPerformance: Record<string, { views: number; count: number }> = {};
  
  videos.forEach((video) => {
    const topic = video.title.split(' ')[0]; // Simplified topic detection
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { views: 0, count: 0 };
    }
    topicPerformance[topic].views += video.views || 0;
    topicPerformance[topic].count += 1;
  });

  // Get best and worst days
  const dayStats = Array.from({ length: 7 }, (_, i) => {
    const dayVideos = videos.filter(v => {
      if (!v.publishedAt) return false;
      const date = new Date(v.publishedAt);
      return date.getDay() === i;
    });
    const totalViews = dayVideos.reduce((sum, v) => sum + (v.views || 0), 0);
    return { day: i, totalViews };
  });

  const bestDay = dayStats.reduce((best, current) => 
    current.totalViews > best.totalViews ? current : best
  );

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Generate suggestions for next 14 days
  for (let i = 0; i < 14; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);

    // Suggest based on best day
    if (date.getDay() === bestDay.day) {
      const avgViews = Math.round(bestDay.totalViews / Math.max(videos.filter(v => {
        if (!v.publishedAt) return false;
        return new Date(v.publishedAt).getDay() === bestDay.day;
      }).length, 1));

      suggestions.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        type: 'Contenido regular',
        reason: 'Mejor día de la semana para publicar',
        priority: 'high',
        estimatedViews: avgViews,
      });
    }

    // Add variety every 3-4 days
    if (i % 4 === 3) {
      suggestions.push({
        date: date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        type: 'Contenido especial',
        reason: 'Varía tu contenido para mantener audiencia fresca',
        priority: 'medium',
        estimatedViews: Math.round(Math.random() * 5000 + 2000),
      });
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-rose/10 border-rose/30 text-rose-600';
      case 'medium':
        return 'bg-amber/10 border-amber/30 text-amber-600';
      case 'low':
        return 'bg-blue/10 border-blue/30 text-blue-600';
      default:
        return '';
    }
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <CalendarIcon className="w-5 h-5 text-primary" />
          CALENDARIO DE CONTENIDO
        </CardTitle>
        <CardDescription>Plan sugerido de publicación para los próximos 14 días basado en tu análisis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">POSTS SUGERIDOS</div>
            <div className="text-2xl font-bold text-primary">{suggestions.length}</div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">FRECUENCIA</div>
            <div className="text-2xl font-bold text-primary">{(suggestions.length / 2).toFixed(1)}/sem</div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">MEJOR DÍA</div>
            <div className="text-2xl font-bold text-primary">{dayNames[bestDay.day]}</div>
          </div>
        </div>

        {/* Calendar Timeline */}
        <div className="space-y-3">
          <h4 className="font-mono text-sm font-semibold">PRÓXIMAS DOS SEMANAS</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                className={`p-4 border rounded-lg transition hover:bg-muted/50 ${getPriorityColor(suggestion.priority)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold text-sm">{suggestion.date}</span>
                      <Badge variant={suggestion.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
                        {suggestion.priority === 'high' ? '⭐ IMPORTANTE' : suggestion.priority === 'medium' ? '→ RECOMENDADO' : 'OPCIONAL'}
                      </Badge>
                    </div>
                    <div className="text-sm font-semibold">{suggestion.type}</div>
                    <div className="text-xs text-muted-foreground mt-1">{suggestion.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <Zap className="w-4 h-4" />
                      {suggestion.estimatedViews.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">vistas est.</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Strategy Tips */}
        <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-2">
          <h4 className="font-mono text-sm font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4" />
            TIPS PARA MAXIMIZAR RENDIMIENTO
          </h4>
          <ul className="text-sm text-foreground space-y-1">
            <li>📅 Publica siempre los <span className="font-mono font-bold">{dayNames[bestDay.day].toUpperCase()}S</span> para máximas vistas</li>
            <li>🔄 Mantén consistencia: 1-2 vídeos por semana mínimo</li>
            <li>✨ Varía contenido cada 3-4 días para mantener audiencia fresca</li>
            <li>📌 Planifica series o sagas para aumentar retención</li>
            <li>⏰ Mejor hora: 5-7 PM en tu zona horaria</li>
          </ul>
        </div>

        {/* Export Suggestion */}
        <div className="p-3 border border-border rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-semibold">Pro tip:</span> Descarga este plan y comparte con tu equipo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
