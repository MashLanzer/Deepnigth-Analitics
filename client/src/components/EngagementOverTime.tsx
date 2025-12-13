import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { VideoMetrics } from '@/lib/analytics';

interface Props { videos: VideoMetrics[] }

export default function EngagementOverTime({ videos }: Props) {
  // Aggregate by week-start (YYYY-MM-DD of week start)
  const weeks = new Map<string, { likes: number; comments: number; shares: number }>();

  // Initialize last 12 weeks with zeros to keep consistent x-axis
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const w = new Date(now);
    w.setDate(now.getDate() - i * 7 - w.getDay());
    const key = w.toISOString().split('T')[0];
    weeks.set(key, { likes: 0, comments: 0, shares: 0 });
  }

  videos.forEach((v) => {
    if (!v.publishedAt) return;
    const d = new Date(v.publishedAt);
    if (isNaN(d.getTime())) return;
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split('T')[0];
    const entry = weeks.get(key) || { likes: 0, comments: 0, shares: 0 };
    entry.likes += v.likes || 0;
    entry.comments += v.comments || 0;
    entry.shares += v.shares || 0;
    weeks.set(key, entry);
  });

  const data = Array.from(weeks.entries()).map(([week, vals]) => ({ week, ...vals }));

  const hasData = data.some(d => (d.likes || d.comments || d.shares) > 0);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-mono">ENGAGEMENT (LIKES / COMMENTS / SHARES) POR SEMANA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip formatter={(value: any, name: string) => [value, name.toUpperCase()]} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <Legend wrapperStyle={{ color: 'var(--muted-foreground)' }} />
                <Area type="monotone" dataKey="likes" stackId="a" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="comments" stackId="a" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.16} strokeWidth={2} />
                <Area type="monotone" dataKey="shares" stackId="a" stroke="var(--color-chart-3)" fill="var(--color-chart-3)" fillOpacity={0.16} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No hay datos de engagement suficientes para mostrar.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
