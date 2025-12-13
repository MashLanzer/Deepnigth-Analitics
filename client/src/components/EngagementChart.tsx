import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoMetrics } from '@/lib/analytics';
import { Activity } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface EngagementChartProps {
  videos: VideoMetrics[];
}

export default function EngagementChart({ videos }: EngagementChartProps) {
  const chartData = videos.map((v) => ({
    views: Number(v.views || 0),
    engagement: Number((v.engagementRate || 0).toFixed(2)),
    title: v.title,
  }))
  .sort((a,b) => b.views - a.views)
  .slice(0, 200); // limit points to avoid overdraw

  if (chartData.length === 0) {
    return (
      <div className="border border-border bg-card/50 p-8 rounded text-center">
        <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground font-mono text-sm">No hay datos de engagement disponibles</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-6 rounded relative group">
      <div className="absolute top-0 right-0 p-2">
        <Activity className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <h3 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary" />
        RELACIÓN VISTAS vs ENGAGEMENT
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="views"
              name="Vistas"
              stroke="var(--muted-foreground)"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              type="number"
              tickFormatter={(v) => formatNumber(v)}
            />
            <YAxis
              dataKey="engagement"
              name="Engagement %"
              stroke="var(--muted-foreground)"
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontFamily: 'JetBrains Mono' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
              formatter={(value: any, name: string) => [typeof value === 'number' ? value : value, name]}
              labelFormatter={(label) => `Vistas: ${formatNumber(label as number)}`}
              // custom renderer will show title from payload
              itemSorter={(a:any, b:any) => b.value - a.value}
            />
            <Scatter name="Videos" data={chartData} fill="var(--color-chart-1)" line={{}} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground font-mono">
          Los puntos más arriba = mayor engagement. Idealmente queremos videos con muchas vistas Y alto engagement.
        </p>
      </div>
    </div>
  );
}
