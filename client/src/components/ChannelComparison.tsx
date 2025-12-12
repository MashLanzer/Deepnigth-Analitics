import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Users, Eye, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import youtubeService, { YouTubeChannel } from '@/services/youtubeService';
import { formatNumber } from '@/lib/utils';

interface ChannelStats {
  title: string;
  subscribers: number;
  views: number;
  videoCount: number;
  growth?: number;
}

export default function ChannelComparison() {
  const [mainChannelId, setMainChannelId] = useState('UCIlucAowvh8GUqsysgbpeMg');
  const [compareChannelId, setCompareChannelId] = useState('');
  const [mainStats, setMainStats] = useState<ChannelStats | null>(null);
  const [compareStats, setCompareStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!compareChannelId.trim()) return;
    
    setLoading(true);
    try {
      const channelInfo = await youtubeService.getChannelInfo(compareChannelId);
      if (channelInfo) {
        setCompareStats({
          title: channelInfo.title || 'Canal desconocido',
          subscribers: channelInfo.subscribers || 0,
          views: channelInfo.viewCount || 0,
          videoCount: channelInfo.videoCount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching comparison channel:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricDifference = (main: number, compare: number) => {
    if (compare === 0) return { percentage: 0, isHigher: true };
    const diff = ((main - compare) / compare) * 100;
    return {
      percentage: Math.abs(diff),
      isHigher: diff > 0,
    };
  };

  const ComparisonMetric = ({ label, mainValue, compareValue }: { label: string; mainValue: number; compareValue: number }) => {
    const { percentage, isHigher } = getMetricDifference(mainValue, compareValue);
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-mono text-muted-foreground">{label}</span>
          <Badge variant={isHigher ? 'default' : 'secondary'} className="gap-1">
            {isHigher ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {percentage.toFixed(1)}%
          </Badge>
        </div>
        <div className="flex justify-between items-end gap-4">
          <div className="flex-1">
            <div className="text-2xl font-bold text-primary">{formatNumber(mainValue)}</div>
            <div className="text-xs text-muted-foreground">Tu canal</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-muted-foreground">{formatNumber(compareValue)}</div>
            <div className="text-xs text-muted-foreground">Comparado</div>
          </div>
        </div>
      </div>
    );
  };

  const chartData = mainStats && compareStats ? [
    {
      name: 'Suscriptores',
      'Tu canal': mainStats.subscribers,
      'Canal comparado': compareStats.subscribers,
    },
    {
      name: 'Vistas totales',
      'Tu canal': mainStats.views,
      'Canal comparado': compareStats.views,
    },
    {
      name: 'Vídeos publicados',
      'Tu canal': mainStats.videoCount,
      'Canal comparado': compareStats.videoCount,
    },
  ] : [];

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <TrendingUp className="w-5 h-5 text-primary" />
          COMPARAR CON OTROS CANALES
        </CardTitle>
        <CardDescription>Compara métricas clave de tu canal con otros creadores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="ID del canal a comparar (ej: UCIlucAowvh8GUqsysgbpeMg)"
              value={compareChannelId}
              onChange={(e) => setCompareChannelId(e.target.value)}
              className="font-mono text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleCompare()}
            />
            <Button 
              onClick={handleCompare} 
              disabled={loading || !compareChannelId.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Buscando...' : 'Comparar'}
            </Button>
          </div>
        </div>

        {/* Comparison Results */}
        {mainStats && compareStats && (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid gap-4">
              <ComparisonMetric 
                label="Suscriptores"
                mainValue={mainStats.subscribers}
                compareValue={compareStats.subscribers}
              />
              <ComparisonMetric 
                label="Vistas totales"
                mainValue={mainStats.views}
                compareValue={compareStats.views}
              />
              <ComparisonMetric 
                label="Vídeos publicados"
                mainValue={mainStats.videoCount}
                compareValue={compareStats.videoCount}
              />
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                    }}
                    formatter={(value) => formatNumber(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="Tu canal" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="Canal comparado" fill="hsl(var(--muted-foreground))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Insights */}
            <div className="p-4 border border-border rounded-lg bg-muted/50">
              <h4 className="font-mono text-sm font-semibold mb-3">ANÁLISIS RÁPIDO</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {mainStats.subscribers > compareStats.subscribers && (
                  <li>✓ Tienes {((mainStats.subscribers / compareStats.subscribers) * 100).toFixed(0)}% más suscriptores</li>
                )}
                {mainStats.views > compareStats.views && (
                  <li>✓ Tienes {((mainStats.views / compareStats.views) * 100).toFixed(0)}% más vistas totales</li>
                )}
                {mainStats.videoCount > compareStats.videoCount && (
                  <li>✓ Has publicado {mainStats.videoCount - compareStats.videoCount} vídeos más</li>
                )}
                {mainStats.subscribers < compareStats.subscribers && (
                  <li>→ Estás {((compareStats.subscribers / mainStats.subscribers) * 100 - 100).toFixed(0)}% por debajo en suscriptores</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
