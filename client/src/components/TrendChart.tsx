import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { VideoMetrics, generateTrendData } from '@/lib/analytics';

interface TrendChartProps {
  videos: VideoMetrics[];
  period?: 'weekly' | 'monthly';
}

export default function TrendChart({ videos, period = 'weekly' }: TrendChartProps) {
  const trendData = generateTrendData(videos, period);

  if (trendData.length === 0) {
    return (
      <div className="border border-border bg-card/50 p-8 rounded text-center">
        <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground font-mono text-sm">
          No hay datos de tendencia disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-6 rounded relative group">
      <div className="absolute top-0 right-0 p-2">
        <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>

      <h3 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary" />
        TENDENCIA DE {period === 'weekly' ? 'VISTAS SEMANALES' : 'VISTAS MENSUALES'}
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF41" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12, fontFamily: 'JetBrains Mono' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', color: '#e0e0e0' }}
              itemStyle={{ color: '#00FF41' }}
              cursor={{ stroke: '#00FF41', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#00FF41"
              strokeWidth={2}
              dot={{ fill: '#00FF41', r: 4 }}
              activeDot={{ r: 6 }}
              name="Vistas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-1">MÁXIMO</p>
            <p className="text-lg font-bold text-primary font-mono">
              {Math.max(...trendData.map((d) => d.views))}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-1">PROMEDIO</p>
            <p className="text-lg font-bold text-primary font-mono">
              {Math.round(trendData.reduce((sum, d) => sum + d.views, 0) / trendData.length)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono mb-1">PERÍODOS</p>
            <p className="text-lg font-bold text-primary font-mono">{trendData.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
