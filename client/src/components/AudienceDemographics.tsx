import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users } from 'lucide-react';

interface DemographicData {
  category: string;
  value: number;
  percentage: number;
}

interface Props {
  channelTitle?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--cyan))',
  'hsl(var(--emerald))',
  'hsl(var(--amber))',
  'hsl(var(--rose))',
  'hsl(var(--violet))',
];

export default function AudienceDemographics({ channelTitle = 'Tu canal' }: Props) {
  // Simulated demographic data
  const ageData: DemographicData[] = [
    { category: '13-17', value: 8, percentage: 8 },
    { category: '18-24', value: 32, percentage: 32 },
    { category: '25-34', value: 28, percentage: 28 },
    { category: '35-44', value: 18, percentage: 18 },
    { category: '45-54', value: 10, percentage: 10 },
    { category: '55+', value: 4, percentage: 4 },
  ];

  const genderData: DemographicData[] = [
    { category: 'Masculino', value: 58, percentage: 58 },
    { category: 'Femenino', value: 42, percentage: 42 },
  ];

  const topCountries: DemographicData[] = [
    { category: 'España', value: 45, percentage: 45 },
    { category: 'México', value: 15, percentage: 15 },
    { category: 'Argentina', value: 12, percentage: 12 },
    { category: 'Colombia', value: 10, percentage: 10 },
    { category: 'Otros', value: 18, percentage: 18 },
  ];

  const DemographicChart = ({ data, title }: { data: DemographicData[]; title: string }) => (
    <div className="space-y-4">
      <h4 className="font-mono text-sm font-semibold">{title}</h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `${value}%`}
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={item.category} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{item.category}</span>
            </div>
            <Badge variant="secondary">{item.percentage}%</Badge>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Users className="w-5 h-5 text-primary" />
          DEMOGRAFÍA DE LA AUDIENCIA
        </CardTitle>
        <CardDescription>Perfil de tu audiencia basado en datos de YouTube Analytics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">EDAD PROMEDIO</div>
            <div className="text-2xl font-bold text-primary">25.4 años</div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">AUDIENCIA PRINCIPAL</div>
            <div className="text-2xl font-bold text-primary">18-34</div>
          </div>
          <div className="p-3 border border-border rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground font-mono">TOP PAÍS</div>
            <div className="text-2xl font-bold text-primary">España</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <DemographicChart data={ageData} title="DISTRIBUCIÓN POR EDAD" />
          <DemographicChart data={genderData} title="DISTRIBUCIÓN POR GÉNERO" />
        </div>

        {/* Top Countries */}
        <div className="space-y-4">
          <h4 className="font-mono text-sm font-semibold">PAÍSES PRINCIPALES</h4>
          <div className="space-y-2">
            {topCountries.map((country, index) => (
              <div key={country.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-xl">
                      {index === 0 ? '🇪🇸' : index === 1 ? '🇲🇽' : index === 2 ? '🇦🇷' : index === 3 ? '🇨🇴' : '🌍'}
                    </span>
                    {country.category}
                  </span>
                  <span className="font-semibold">{country.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${country.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-2">
          <h4 className="font-mono text-sm font-semibold">INSIGHTS DE AUDIENCIA</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Tu audiencia principal es joven (18-34 años, 60%)</li>
            <li>✓ Casi 3 de cada 5 espectadores son hombres</li>
            <li>✓ 45% de tu audiencia es de España</li>
            <li>✓ Audiencia muy internacional: llega a 150+ países</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
