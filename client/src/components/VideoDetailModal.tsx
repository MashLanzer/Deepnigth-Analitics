import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { VideoMetrics } from '@/lib/analytics';
import { formatNumber, formatDate } from '@/lib/utils';
import SubscriberGrowthChart from './SubscriberGrowthChart';

interface Props {
  video: VideoMetrics | null;
  open: boolean;
  onClose: () => void;
}

export default function VideoDetailModal({ video, open, onClose }: Props) {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={(v)=>{ if(!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-mono">{video.title}</DialogTitle>
          <DialogDescription>{video.description || 'Detalles del vídeo'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover rounded" />
            </div>
            <div className="space-y-2">
              <div className="text-sm">Vistas: {formatNumber(video.views)}</div>
              <div className="text-sm">Likes: {formatNumber(video.likes || 0)}</div>
              <div className="text-sm">Comentarios: {formatNumber(video.comments || 0)}</div>
              <div className="text-sm">Engagement: {(video.engagementRate||0).toFixed(2)}%</div>
              <div className="text-sm">Publicado: {video.publishedAt ? formatDate(video.publishedAt) : '—'}</div>
            </div>
          </div>

          <div>
            <SubscriberGrowthChart videos={[video]} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
