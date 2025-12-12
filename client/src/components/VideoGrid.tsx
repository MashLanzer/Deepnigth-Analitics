import { YouTubeVideo } from '@/services/youtubeService';
import { formatNumber, formatDate } from '@/lib/utils';
import { Eye, ThumbsUp, MessageCircle, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VideoGridProps {
  videos: (YouTubeVideo | any)[];
}

function parseDuration(duration: string): string {
  // PT format: PTnHnMnS
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);
  
  if (!matches) return '0:00';
  
  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function VideoGrid({ videos }: VideoGridProps) {
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay videos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <a
          key={video.id}
          href={`https://youtube.com/watch?v=${video.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="overflow-hidden hover:border-primary/50 transition-colors h-full cursor-pointer">
            <div className="relative overflow-hidden bg-black/50 aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="white" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-mono text-white">
                {parseDuration(video.duration)}
              </div>
            </div>
            <CardContent className="pt-4">
              <h3 className="font-mono text-sm font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground font-mono">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{formatNumber((video as any).viewCount || (video as any).views)} vistas</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatNumber((video as any).likeCount || (video as any).likes)} likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{formatNumber((video as any).commentCount || (video as any).comments)} comentarios</span>
                </div>
                <div className="text-xs pt-2 border-t border-border">
                  {formatDate((video as any).publishedAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  );
}
