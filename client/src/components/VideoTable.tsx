import { useState } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { formatNumber, formatDate } from '@/lib/utils';
import { VideoMetrics, sortVideos } from '@/lib/analytics';

type SortField = 'views' | 'engagement' | 'likes' | 'comments' | 'date';

interface VideoTableProps {
  videos: VideoMetrics[];
  onVideoSelect?: (video: VideoMetrics) => void;
}

export default function VideoTable({ videos, onVideoSelect }: VideoTableProps) {
  const [sortBy, setSortBy] = useState<SortField>('views');
  const [sortDesc, setSortDesc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedVideos = sortVideos(videos, sortBy, sortDesc);
  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const paginatedVideos = sortedVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(field);
      setSortDesc(true);
    }
    setCurrentPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 opacity-30" />;
    return sortDesc ? (
      <TrendingDown className="w-4 h-4 text-primary" />
    ) : (
      <TrendingUp className="w-4 h-4 text-primary" />
    );
  };

  return (
    <div className="border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-mono text-muted-foreground">
                Video
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('views')}
              >
                <div className="flex items-center justify-end gap-2">
                  Vistas <SortIcon field="views" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('likes')}
              >
                <div className="flex items-center justify-end gap-2">
                  Likes <SortIcon field="likes" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('comments')}
              >
                <div className="flex items-center justify-end gap-2">
                  Comentarios <SortIcon field="comments" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('engagement')}
              >
                <div className="flex items-center justify-end gap-2">
                  Engagement <SortIcon field="engagement" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-mono text-muted-foreground cursor-pointer hover:text-primary transition-colors"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center justify-end gap-2">
                  Fecha <SortIcon field="date" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedVideos.map((video, idx) => (
              <tr
                key={video.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onVideoSelect?.(video)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    {video.thumbnail && typeof video.thumbnail === 'string' && (
                      <img
                        src={video.thumbnail}
                        alt={video.title || 'Video'}
                        className="w-12 h-12 object-cover rounded bg-muted flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2 text-foreground">
                        {video.title || 'Sin título'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {video.publishedAt && typeof video.publishedAt === 'string' ? formatDate(video.publishedAt) : 'Sin fecha'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-mono font-semibold text-primary">
                    {formatNumber(video.views)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-mono text-muted-foreground">
                    {formatNumber(video.likes || 0)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-mono text-muted-foreground">
                    {formatNumber(video.comments || 0)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-sm font-mono font-semibold ${
                        (video.engagementRate || 0) > 5 ? 'text-green-500' : 'text-orange-500'
                      }`}
                    >
                      {(video.engagementRate || 0).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-mono text-muted-foreground">
                    {video.publishedAt ? formatDate(video.publishedAt) : '—'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
        <div className="text-xs text-muted-foreground font-mono">
          Mostrando {paginatedVideos.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} —{' '}
          {Math.min(currentPage * itemsPerPage, sortedVideos.length)} de {sortedVideos.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed font-mono transition-colors"
          >
            Anterior
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => Math.abs(p - currentPage) <= 1 || p === 1 || p === totalPages)
              .map((p, idx, arr) => (
                <div key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-2 text-muted-foreground">…</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(p)}
                    className={`px-3 py-1 text-xs border rounded font-mono transition-colors ${
                      p === currentPage
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    {p}
                  </button>
                </div>
              ))}
          </div>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed font-mono transition-colors"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
