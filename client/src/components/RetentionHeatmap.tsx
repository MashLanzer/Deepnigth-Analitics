import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface Props { videos?: any[] }

export default function RetentionHeatmap({ videos = [] }: Props) {
  // Simulated retention series per minute normalized to percent
  const minutes = Array.from({ length: 10 }, (_, i) => i + 1);
  const data = minutes.map(m => ({ minute: `${m}m`, retention: Math.max(5, Math.round(100 - m * (5 + Math.random()*3))) }));

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-mono">RETENCIÓN ESTIMADA POR MINUTO</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="minute" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Area dataKey="retention" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
