import { useEffect, useState } from 'react';
import youtubeService, { ChannelStats, YouTubeChannel, YouTubeVideo } from '@/services/youtubeService';

export function useYouTubeChannel(channelId: string | null) {
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!channelId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await youtubeService.getChannelStats(channelId);
        setStats(data);
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
