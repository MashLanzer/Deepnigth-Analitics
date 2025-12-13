import axios from 'axios';

const API_BASE_URL = '/api';
const YOUTUBE_API_KEY = 'AIzaSyAPM9WeKXZTxfg3q5tNysdiFxjV1ZagUyQ'; // API Key pública para cliente

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscribers: number;
  viewCount: number;
  videoCount: number;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  duration: string;
}

export interface ChannelStats {
  dailyViews: Array<{ date: string; views: number }>;
  videoPerformance: YouTubeVideo[];
  channelInfo: YouTubeChannel;
}

class YouTubeService {
  async getChannelStats(channelId: string): Promise<ChannelStats> {
    try {
      // Fetch directly from YouTube API with client-side key
      return await this.fetchChannelStatsFromYouTube(channelId);
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      throw error;
    }
  }

  async getChannelInfo(channelId: string): Promise<YouTubeChannel> {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: channelId,
          part: 'snippet,statistics',
        },
      });

      const channel = response.data.items[0];
      if (!channel) throw new Error('Canal no encontrado');

      return {
        id: channel.id || '',
        title: channel.snippet?.title || 'Sin título',
        description: channel.snippet?.description || '',
        thumbnail: channel.snippet?.thumbnails?.medium?.url || channel.snippet?.thumbnails?.default?.url || '',
        subscribers: Math.max(0, parseInt(channel.statistics?.subscriberCount) || 0),
        viewCount: Math.max(0, parseInt(channel.statistics?.viewCount) || 0),
        videoCount: Math.max(0, parseInt(channel.statistics?.videoCount) || 0),
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  }

  async getTopVideos(channelId: string, limit: number = 10): Promise<YouTubeVideo[]> {
    try {
      // Get uploads playlist
      const channelResponse = await axios.get(`https://www.googleapis.com/youtube/v3/channels`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: channelId,
          part: 'contentDetails',
        },
      });

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Get videos from playlist
      const playlistResponse = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
        params: {
          key: YOUTUBE_API_KEY,
          playlistId: uploadsPlaylistId,
          part: 'snippet,contentDetails',
          maxResults: limit,
        },
      });

      const videoIds = playlistResponse.data.items.map((item: any) => item.contentDetails.videoId);

      // Get full video details
      const detailsResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoIds.join(','),
          part: 'snippet,contentDetails,statistics',
        },
      });

      return detailsResponse.data.items.map((video: any) => ({
        id: video.id || '',
        title: video.snippet?.title || 'Sin título',
        thumbnail: video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.default?.url || '',
        viewCount: Math.max(0, parseInt(video.statistics?.viewCount) || 0),
        likeCount: Math.max(0, parseInt(video.statistics?.likeCount || '0') || 0),
        commentCount: Math.max(0, parseInt(video.statistics?.commentCount || '0') || 0),
        publishedAt: video.snippet?.publishedAt || new Date().toISOString(),
        duration: video.contentDetails?.duration || 'PT0S',
      }));
    } catch (error) {
      console.error('Error fetching top videos:', error);
      throw error;
    }
  }

  private async fetchChannelStatsFromYouTube(channelId: string): Promise<ChannelStats> {
    const [channelInfo, videos] = await Promise.all([
      this.getChannelInfo(channelId),
      this.getTopVideos(channelId, 10),
    ]);

    // Generate daily views data
    const dailyViews = this.generateDailyStats(videos);

    return {
      channelInfo,
      videoPerformance: videos,
      dailyViews,
    };
  }

  private generateDailyStats(videos: YouTubeVideo[]) {
    // Build a last-30-days time series using video publish dates and view counts
    const days = 30;
    const result: Array<{ date: string; views: number }> = [];
    const now = new Date();

    // Initialize last N days with zero views
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      result.push({ date: d.toISOString().split('T')[0], views: 0 });
    }

    // Helper to find index by ISO date string (YYYY-MM-DD)
    const idxByDate = new Map(result.map((r, i) => [r.date, i]));

    // Aggregate video views by publish date where possible
    videos.forEach((v) => {
      if (!v.publishedAt) return;
      try {
        const pub = new Date(v.publishedAt);
        if (isNaN(pub.getTime())) return;
        const iso = pub.toISOString().split('T')[0];
        if (idxByDate.has(iso)) {
          result[idxByDate.get(iso)!].views += v.viewCount || 0;
        } else {
          // If published earlier than range, add a small portion to the most recent day
          result[result.length - 1].views += Math.floor((v.viewCount || 0) * 0.05);
        }
      } catch (e) {
        // ignore malformed dates
      }
    });

    // If totals are all zero (very small channels), fallback to simple distribution
    const total = result.reduce((s, r) => s + r.views, 0);
    if (total === 0) {
      const avg = Math.max(10, Math.floor((videos.reduce((s, v) => s + (v.viewCount || 0), 0) || 100) / days));
      return result.map((r) => ({ ...r, views: avg }));
    }

    return result;
  }

  async getVideoAnalytics(videoId: string) {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
          key: YOUTUBE_API_KEY,
          id: videoId,
          part: 'snippet,statistics,contentDetails',
        },
      });
      return response.data.items[0];
    } catch (error) {
      console.error('Error fetching video analytics:', error);
      throw error;
    }
  }
}

export default new YouTubeService();
