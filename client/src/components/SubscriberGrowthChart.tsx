import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatNumber } from '@/lib/utils';
import { VideoMetrics } from '@/lib/analytics';

interface Props {
  videos: VideoMetrics[];
}

export default function SubscriberGrowthChart({ videos }: Props) {
  // Build last 12 months buckets (zero-filled)
  const now = new Date();
  const months = 12;
  const map = new Map<string, number>();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    map.set(key, 0);
  }

  // approximate subscribers driven by videos: views * conversionRate
  const conversion = 0.001; // 0.1% conversion by default
  videos.forEach((v) => {
    const date = v.publishedAt ? new Date(v.publishedAt) : null;
    const key = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : null;
    const add = Math.round((v.views || 0) * conversion);
    if (key && map.has(key)) {
      map.set(key, map.get(key)! + add);
    } else {
      // add small portion to most recent month
      const lastKey = Array.from(map.keys()).pop()!;
      map.set(lastKey, (map.get(lastKey) || 0) + Math.round(add * 0.2));
    }
  });

  const data = Array.from(map.entries()).map(([month, subscribers]) => ({ month, subscribers }));

  // cumulative
  let cum = 0;
  const cumData = data.map((d) => {
    cum += d.subscribers;
    return { month: d.month, subscribers: cum };
  });

  const hasData = cumData.some((d) => d.subscribers > 0);

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-mono flex items-center gap-2">CRECIMIENTO DE SUSCRIPTORES (ESTIMADO)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" tickFormatter={(m) => m.slice(5)} />
                <YAxis stroke="var(--muted-foreground)" tickFormatter={(v) => formatNumber(v)} />
                <Tooltip formatter={(v: number) => formatNumber(v)} labelFormatter={(l) => `Mes: ${l}`} contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                <Area type="monotone" dataKey="subscribers" stroke="var(--color-chart-2)" fill="url(#gradSubs)" fillOpacity={0.6} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No hay datos suficientes para estimar crecimiento de suscriptores.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
