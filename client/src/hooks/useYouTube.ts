import { useEffect, useState } from 'react';
import youtubeService, { ChannelStats, YouTubeChannel, YouTubeVideo } from '@/services/youtubeService';
import { enrichVideoMetrics, VideoMetrics } from '@/lib/analytics';

// Make EnrichedChannelStats compatible with ChannelStats but allow videoPerformance to be enriched
export interface EnrichedChannelStats extends Omit<ChannelStats, 'videoPerformance'> {
  videoPerformance?: VideoMetrics[];
}

export function useYouTubeChannel(channelId: string | null) {
  const [stats, setStats] = useState<EnrichedChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await youtubeService.getChannelStats(channelId);
        
        // Enrich video data with engagement metrics
        const enrichedVideos = (data.videoPerformance || []).map(enrichVideoMetrics);
        
        const enrichedStats: EnrichedChannelStats = {
          ...data,
          videoPerformance: enrichedVideos as any,
        };
        
        setStats(enrichedStats);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId]);

  return { stats, loading, error };
}

export function useYouTubeChannelInfo(channelId: string | null) {
  const [channelInfo, setChannelInfo] = useState<YouTubeChannel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const info = await youtubeService.getChannelInfo(channelId);
        setChannelInfo(info);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch channel info'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId]);

  return { channelInfo, loading, error };
}

export function useYouTubeTopVideos(channelId: string | null, limit: number = 10) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const topVideos = await youtubeService.getTopVideos(channelId, limit);
        setVideos(topVideos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [channelId, limit]);

  return { videos, loading, error };
}
