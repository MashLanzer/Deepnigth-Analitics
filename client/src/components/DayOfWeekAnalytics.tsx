import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import { VideoMetrics } from '@/lib/analytics';

interface DayOfWeekStats {
  day: string;
  date: string;
  videos: number;
  totalViews: number;
  avgEngagement: number;
}

interface Props {
  videos: VideoMetrics[];
}

export default function DayOfWeekAnalytics({ videos }: Props) {
  const dayLabels = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayStats: DayOfWeekStats[] = Array.from({ length: 7 }, (_, i) => ({
    day: dayLabels[i],
    date: i === 0 ? 'Dom' : i === 1 ? 'Lun' : i === 2 ? 'Mar' : i === 3 ? 'Mié' : i === 4 ? 'Jue' : i === 5 ? 'Vie' : 'Sab',
    videos: 0,
    totalViews: 0,
    avgEngagement: 0,
  }));

  // Group videos by day of week
  const videosByDay = Array.from({ length: 7 }, () => [] as VideoMetrics[]);
  
  videos.forEach((video) => {
    if (video.publishedAt) {
      const date = new Date(video.publishedAt);
      const dayIndex = date.getDay();
      videosByDay[dayIndex].push(video);
    }
  });

  // Calculate statistics for each day
  dayStats.forEach((stat, index) => {
    const dayVideos = videosByDay[index];
    stat.videos = dayVideos.length;
    stat.totalViews = dayVideos.reduce((sum, v) => sum + (v.views || 0), 0);
    
    if (dayVideos.length > 0) {
      const totalEngagement = dayVideos.reduce((sum, v) => sum + (v.engagement || 0), 0);
      stat.avgEngagement = totalEngagement / dayVideos.length;
    }
  });

  // Find best day for publishing
  const bestDay = dayStats.reduce((best, current) => 
    current.totalViews > best.totalViews ? current : best
  );

  const bestEngagementDay = dayStats.reduce((best, current) => 
    current.avgEngagement > best.avgEngagement ? current : best
  );

  const chartData = dayStats.map(stat => ({
    day: stat.date,
    'Vídeos': stat.videos,
    'Vistas (÷1000)': Math.round(stat.totalViews / 1000),
    'Engagement (%)': parseFloat(stat.avgEngagement.toFixed(2)),
  }));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Calendar className="w-5 h-5 text-primary" />
          ANÁLISIS POR DÍA DE LA SEMANA
        </CardTitle>
        <CardDescription>Cuándo publican mejor y cuándo hay más engagement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg bg-muted/50">
            <div className="text-sm font-mono text-muted-foreground mb-2">MEJOR DÍA (VISTAS)</div>
            <div className="text-2xl font-bold text-primary">{bestDay.day}</div>
            <div className="text-xs text-muted-foreground mt-1">{bestDay.videos} vídeos • {(bestDay.totalViews / 1000).toFixed(0)}k vistas</div>
          </div>
          <div className="p-4 border border-border rounded-lg bg-muted/50">
            <div className="text-sm font-mono text-muted-foreground mb-2">MEJOR ENGAGEMENT</div>
            <div className="text-2xl font-bold text-primary">{bestEngagementDay.day}</div>
            <div className="text-xs text-muted-foreground mt-1">{bestEngagementDay.avgEngagement.toFixed(1)}% engagement promedio</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                }}
              />
              <Legend />
              <Bar dataKey="Vídeos" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Vistas (÷1000)" fill="hsl(var(--cyan))" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Engagement (%)" fill="hsl(var(--amber))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Day Statistics Table */}
        <div className="space-y-2">
          <h4 className="font-mono text-sm font-semibold">ESTADÍSTICAS DETALLADAS</h4>
          <div className="grid gap-2">
            {dayStats.map((stat) => (
              <div key={stat.day} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition">
                <div className="flex-1">
                  <div className="font-mono font-semibold">{stat.day}</div>
                  <div className="text-xs text-muted-foreground">{stat.videos} vídeos publicados</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{(stat.totalViews / 1000).toFixed(0)}k vistas</div>
                  <Badge variant={stat.avgEngagement > 3 ? "default" : "secondary"} className="text-xs">
                    {stat.avgEngagement.toFixed(2)}% engagement
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
          <p className="text-sm text-foreground">
            <span className="font-semibold">💡 Recomendación:</span> Publica preferentemente los <span className="font-mono font-bold">{bestDay.day.toUpperCase()}S</span> para maximizar vistas. 
            Los <span className="font-mono font-bold">{bestEngagementDay.day.toUpperCase()}S</span> tienen el mejor engagement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
