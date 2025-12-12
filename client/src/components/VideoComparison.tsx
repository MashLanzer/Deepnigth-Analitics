import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { VideoMetrics } from '@/lib/analytics';

interface VideoComparisonProps {
  best?: VideoMetrics;
  worst?: VideoMetrics;
}

export default function VideoComparison({ best, worst }: VideoComparisonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Best Video */}
      {best && (
        <div className="border border-green-500/30 bg-green-500/5 p-6 rounded">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-mono text-sm text-green-500 font-semibold">MEJOR DESEMPEÑO</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium line-clamp-2 mb-2">{best.title || 'Video'}</p>
              {best.thumbnail && typeof best.thumbnail === 'string' && (
                <img
                  src={best.thumbnail}
                  alt={best.title || 'Video'}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Vistas</p>
                <p className="text-lg font-mono font-bold text-green-500">
                  {formatNumber(best.views)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Engagement</p>
                <p className="text-lg font-mono font-bold text-green-500">
                  {(best.engagementRate || 0).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Likes</p>
                <p className="text-lg font-mono font-bold text-green-500">
                  {formatNumber(best.likes || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Comentarios</p>
                <p className="text-lg font-mono font-bold text-green-500">
                  {formatNumber(best.comments || 0)}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-green-500/20">
              <p className="text-xs text-muted-foreground font-mono">
                Este video destaca por su alto engagement y alcance. Analiza qué hace que sea
                exitoso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Worst Video */}
      {worst && (
        <div className="border border-orange-500/30 bg-orange-500/5 p-6 rounded">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              <h3 className="font-mono text-sm text-orange-500 font-semibold">MENOR DESEMPEÑO</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium line-clamp-2 mb-2">{worst.title || 'Video'}</p>
              {worst.thumbnail && typeof worst.thumbnail === 'string' && (
                <img
                  src={worst.thumbnail}
                  alt={worst.title || 'Video'}
                  className="w-full h-32 object-cover rounded mb-4"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Vistas</p>
                <p className="text-lg font-mono font-bold text-orange-500">
                  {formatNumber(worst.views)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Engagement</p>
                <p className="text-lg font-mono font-bold text-orange-500">
                  {(worst.engagementRate || 0).toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Likes</p>
                <p className="text-lg font-mono font-bold text-orange-500">
                  {formatNumber(worst.likes || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-mono mb-1">Comentarios</p>
                <p className="text-lg font-mono font-bold text-orange-500">
                  {formatNumber(worst.comments || 0)}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-orange-500/20">
              <p className="text-xs text-muted-foreground font-mono">
                Este video puede mejorar. Considera ajustar el título, descripción o contenido.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
