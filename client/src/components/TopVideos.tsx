import { VideoMetrics, sortVideos } from '@/lib/analytics';
import { formatNumber } from '@/lib/utils';
import { Medal, TrendingUp } from 'lucide-react';

interface TopVideosProps {
  videos: VideoMetrics[];
  limit?: number;
}

export default function TopVideos({ videos, limit = 5 }: TopVideosProps) {
  const topVideos = sortVideos(videos, 'engagement', true).slice(0, limit);

  if (topVideos.length === 0) {
    return (
      <div className="border border-border bg-card/50 p-8 rounded text-center">
        <Medal className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
        <p className="text-muted-foreground font-mono text-sm">No hay videos disponibles</p>
      </div>
    );
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-500';
    if (index === 1) return 'text-gray-400';
    if (index === 2) return 'text-orange-600';
    return 'text-muted-foreground';
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="border border-border bg-card p-6 rounded">
      <h3 className="font-mono text-sm text-muted-foreground mb-6 flex items-center gap-2">
        <span className="w-1 h-4 bg-primary" />
        TOP {limit} VIDEOS POR ENGAGEMENT
      </h3>

      <div className="space-y-3">
        {topVideos.map((video, idx) => (
          <div
            key={video.id}
            className="flex items-start gap-4 p-4 border border-border/50 rounded hover:bg-muted/30 transition-colors"
          >
            {/* Medal */}
            <div className={`text-2xl font-bold ${getMedalColor(idx)} flex-shrink-0 pt-1`}>
              {getMedalEmoji(idx)}
            </div>

            {/* Video Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2 text-foreground mb-2">{video.title}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">Vistas</p>
                  <p className="font-mono font-semibold text-primary text-sm">
                    {formatNumber(video.views)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">Engagement</p>
                  <p className="font-mono font-semibold text-green-500 text-sm">
                    {(video.engagementRate || 0).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">Likes</p>
                  <p className="font-mono text-muted-foreground text-sm">{formatNumber(video.likes || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-mono mb-1">Comentarios</p>
                  <p className="font-mono text-muted-foreground text-sm">
                    {formatNumber(video.comments || 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Trend Badge */}
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1 px-3 py-2 border border-green-500/30 bg-green-500/10 rounded text-xs font-mono text-green-500">
                <TrendingUp className="w-3 h-3" />
                Top {idx + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
