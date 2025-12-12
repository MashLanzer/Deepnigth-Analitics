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
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'];
    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    const avgDailyViews = Math.floor(totalViews / (7 * Math.max(videos.length, 1))) || 100;

    return days.map((name) => ({
      date: name,
      views: Math.floor(avgDailyViews * (0.5 + Math.random() * 1.5)),
    }));
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
