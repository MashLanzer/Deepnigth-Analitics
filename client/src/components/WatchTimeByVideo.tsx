import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { VideoMetrics } from '@/lib/analytics';
import { formatNumber } from '@/lib/utils';

interface Props { videos: VideoMetrics[] }

export default function WatchTimeByVideo({ videos }: Props) {
  // Use watchTime if available, otherwise approximate by views * avg view duration (seconds -> minutes)
  const data = videos.map(v => {
    const avgSec = v.avgViewDuration || 30; // seconds assumed
    const watchMins = v.watchTime ? Math.round((v.watchTime || 0) / 60) : Math.round(((v.views || 0) * avgSec) / 60);
    return {
      title: v.title.length > 36 ? v.title.slice(0,33) + '...' : v.title,
      watchTime: watchMins,
      views: v.views || 0,
    };
  })
  .sort((a,b)=>b.watchTime - a.watchTime)
  .slice(0,10);

  if (data.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-mono">TOP 10: TIEMPO DE VISUALIZACIÓN POR VIDEO (min)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">No hay datos disponibles</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-mono">TOP 10: TIEMPO DE VISUALIZACIÓN POR VIDEO (min)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)' }} />
              <YAxis dataKey="title" type="category" stroke="var(--muted-foreground)" width={220} tick={{ fill: 'var(--muted-foreground)' }} />
              <Tooltip formatter={(value: any, name: string, props: any) => [formatNumber(value), 'Minutos']} labelFormatter={(label) => `Video: ${label}`} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
              <Bar dataKey="watchTime" fill="var(--color-chart-1)" radius={[6,6,6,6]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
