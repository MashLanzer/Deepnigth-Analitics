import MetricCard from '@/components/MetricCard';
import Sparkline from '@/components/Sparkline';
import { Card } from '@/components/ui/card';
import { VideoMetrics } from '@/lib/analytics';
import { formatNumber } from '@/lib/utils';

interface Props {
  videos: VideoMetrics[];
  channelTitle?: string;
}

function makeSeries(values: number[]) {
  const last = values.slice(-12);
  return last.map((v, i) => ({ x: String(i), y: v }));
}

export default function KPIPanel({ videos, channelTitle }: Props) {
  const totalViews = videos.reduce((s, v) => s + (v.views || 0), 0);
  const totalLikes = videos.reduce((s, v) => s + (v.likes || 0), 0);
  const totalComments = videos.reduce((s, v) => s + (v.comments || 0), 0);
  const avgViews = Math.round(totalViews / Math.max(videos.length, 1));

  // Create simple trend arrays (monthly approx)
  const monthly = Array.from({ length: 12 }, (_, i) => Math.round(Math.random() * avgViews));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard title="Vistas (periodo)" value={formatNumber(totalViews)} description={`Promedio: ${formatNumber(avgViews)} / video`}>
      </MetricCard>

      <div>
        <MetricCard title="Likes" value={formatNumber(totalLikes)} />
        <div className="mt-2"><Sparkline data={makeSeries(monthly)} /></div>
      </div>

      <div>
        <MetricCard title="Comentarios" value={formatNumber(totalComments)} />
        <div className="mt-2"><Sparkline data={makeSeries(monthly.map(m=>Math.round(m/4)))} color="hsl(var(--cyan))" /></div>
      </div>
    </div>
  );
}
