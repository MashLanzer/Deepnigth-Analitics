import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface GrowthDataPoint {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
}

interface Props {
  channelTitle?: string;
}

export default function GrowthAnalytics({ channelTitle = 'Tu canal' }: Props) {
  // Simulated growth data for last 12 months
  const growthData: GrowthDataPoint[] = [
    { date: 'Dic 2023', subscribers: 12400, views: 48000, videos: 4 },
    { date: 'Ene 2024', subscribers: 13200, views: 52000, videos: 3 },
    { date: 'Feb 2024', subscribers: 14100, views: 61000, videos: 4 },
    { date: 'Mar 2024', subscribers: 15300, views: 73000, videos: 5 },
    { date: 'Abr 2024', subscribers: 16500, views: 68000, videos: 3 },
    { date: 'May 2024', subscribers: 18200, views: 82000, videos: 4 },
    { date: 'Jun 2024', subscribers: 20100, views: 95000, videos: 5 },
    { date: 'Jul 2024', subscribers: 22300, views: 108000, videos: 6 },
    { date: 'Ago 2024', subscribers: 24800, views: 120000, videos: 5 },
    { date: 'Sep 2024', subscribers: 27400, views: 135000, videos: 4 },
    { date: 'Oct 2024', subscribers: 29100, views: 148000, videos: 5 },
    { date: 'Nov 2024', subscribers: 31200, views: 165000, videos: 6 },
    { date: 'Dic 2024', subscribers: 33500, views: 182000, videos: 5 },
  ];

  // Calculate growth metrics
  const firstData = growthData[0];
  const lastData = growthData[growthData.length - 1];
  
  const subscriberGrowth = ((lastData.subscribers - firstData.subscribers) / firstData.subscribers) * 100;
  const viewsGrowth = ((lastData.views - firstData.views) / firstData.views) * 100;
  const totalVideos = growthData.reduce((sum, d) => sum + d.videos, 0);
  
  const subscribersPerMonth = Math.round((lastData.subscribers - firstData.subscribers) / growthData.length);
  const viewsPerVideo = Math.round(lastData.views / lastData.videos);
  const videoFrequency = (totalVideos / growthData.length).toFixed(1);

  const projectedMonths = 6;
  const projectedSubscribers = Math.round(lastData.subscribers + (subscribersPerMonth * projectedMonths));
  const projectedGrowth = ((projectedSubscribers - lastData.subscribers) / lastData.subscribers) * 100;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <TrendingUp className="w-5 h-5 text-primary" />
          ANÁLISIS DE CRECIMIENTO
        </CardTitle>
        <CardDescription>Tendencias de crecimiento y proyecciones para los próximos meses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">CRECIMIENTO ANUAL</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-2xl font-bold text-primary">+{subscriberGrowth.toFixed(0)}%</div>
              <ArrowUp className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">SUSCRIPTORES/MES</div>
            <div className="text-2xl font-bold text-primary">+{subscribersPerMonth}</div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">VISTAS/VÍDEO</div>
            <div className="text-2xl font-bold text-primary">{(viewsPerVideo / 1000).toFixed(0)}k</div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">FRECUENCIA</div>
            <div className="text-2xl font-bold text-primary">{videoFrequency}</div>
            <div className="text-xs text-muted-foreground">videos/mes</div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="space-y-3">
          <h4 className="font-mono text-sm font-semibold">EVOLUCIÓN DE SUSCRIPTORES (12 MESES)</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                  formatter={(value) => value.toLocaleString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorSubscribers)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Views Trend */}
        <div className="space-y-3">
          <h4 className="font-mono text-sm font-semibold">EVOLUCIÓN DE VISTAS (12 MESES)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                  }}
                  formatter={(value) => (value as number).toLocaleString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="hsl(var(--cyan))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Projections */}
        <div className="p-4 border border-primary/20 rounded-lg bg-primary/5 space-y-3">
          <h4 className="font-mono text-sm font-semibold">PROYECCIÓN (PRÓXIMOS {projectedMonths} MESES)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground font-mono mb-1">SUSCRIPTORES ESTIMADOS</div>
              <div className="text-3xl font-bold text-primary">{(projectedSubscribers / 1000).toFixed(0)}k</div>
              <div className="flex items-center gap-1 mt-1 text-sm text-emerald-600">
                <ArrowUp className="w-3 h-3" />
                +{projectedGrowth.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-mono mb-1">VISTAS ESTIMADAS</div>
              <div className="text-3xl font-bold text-primary">{(lastData.views / 1000 * 1.5).toFixed(0)}k</div>
              <div className="text-sm text-muted-foreground mt-1">si mantienes ritmo actual</div>
            </div>
          </div>
        </div>

        {/* Health Indicators */}
        <div className="space-y-3">
          <h4 className="font-mono text-sm font-semibold">INDICADORES DE SALUD DEL CANAL</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm">Crecimiento de suscriptores</span>
              <Badge variant="default" className="bg-emerald-600/10 text-emerald-700">✓ Muy Bueno</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm">Consistencia de publicaciones</span>
              <Badge variant="default" className="bg-amber-600/10 text-amber-700">→ Bueno</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm">Vistas por vídeo</span>
              <Badge variant="default" className="bg-primary/10 text-primary">✓ Excelente</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <span className="text-sm">Tendencia general</span>
              <Badge variant="default" className="bg-emerald-600/10 text-emerald-700">📈 Al alza</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
