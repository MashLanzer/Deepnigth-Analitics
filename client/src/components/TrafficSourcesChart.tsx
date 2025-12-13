import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props { }

export default function TrafficSourcesChart(_: Props) {
  // Simulated sources
  const data = [
    { name: 'Búsqueda YouTube', value: 52 },
    { name: 'Sugerencias', value: 18 },
    { name: 'Redes Sociales', value: 12 },
    { name: 'Directo', value: 8 },
    { name: 'Externo', value: 10 },
  ];

  const COLORS = ['hsl(var(--primary))','hsl(var(--cyan))','hsl(var(--emerald))','hsl(var(--amber))','hsl(var(--violet))'];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-mono">FUENTES DE TRÁFICO (ESTIMADO)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
