import axios from 'axios';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

console.log('YouTube API Key configured:', !!API_KEY);
if (!API_KEY) {
  console.error('❌ YOUTUBE_API_KEY environment variable is not set. YouTube API calls will fail.');
}

export interface YouTubeChannelResponse {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  statistics: {
    subscriberCount: string;
    viewCount: string;
    videoCount: string;
  };
}

export interface YouTubeVideoResponse {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount: string;
  };
}

class YouTubeBackendService {
  async getChannelInfo(channelId: string) {
    try {
      const response = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
        params: {
          key: API_KEY,
          id: channelId,
          part: 'snippet,statistics',
        },
      });

      const channel = response.data.items[0];
      if (!channel) throw new Error('Channel not found');

      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.medium?.url || channel.snippet.thumbnails.default?.url,
        subscribers: parseInt(channel.statistics.subscriberCount) || 0,
        viewCount: parseInt(channel.statistics.viewCount) || 0,
        videoCount: parseInt(channel.statistics.videoCount) || 0,
      };
    } catch (error) {
      console.error('Error fetching channel info:', error);
      throw error;
    }
  }

  async getChannelVideos(channelId: string, maxResults: number = 50) {
    try {
      // First, get uploads playlist ID
      const channelResponse = await axios.get(`${YOUTUBE_API_BASE}/channels`, {
        params: {
          key: API_KEY,
          id: channelId,
          part: 'contentDetails',
        },
      });

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Then get videos from the uploads playlist
      const videosResponse = await axios.get(`${YOUTUBE_API_BASE}/playlistItems`, {
        params: {
          key: API_KEY,
          playlistId: uploadsPlaylistId,
          part: 'snippet,contentDetails',
          maxResults,
        },
      });

      const videoIds = videosResponse.data.items.map((item: any) => item.contentDetails.videoId);

      // Get full video details including statistics
      const detailsResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
        params: {
          key: API_KEY,
          id: videoIds.join(','),
          part: 'snippet,contentDetails,statistics',
        },
      });

      return detailsResponse.data.items.map((video: YouTubeVideoResponse) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
        viewCount: parseInt(video.statistics.viewCount) || 0,
        likeCount: parseInt(video.statistics.likeCount || '0') || 0,
        commentCount: parseInt(video.statistics.commentCount) || 0,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
      }));
    } catch (error) {
      console.error('Error fetching channel videos:', error);
      throw error;
    }
  }

  async getChannelStats(channelId: string) {
    try {
      const channelInfo = await this.getChannelInfo(channelId);
      const videos = await this.getChannelVideos(channelId, 10);

      // Generate mock daily views data based on video views
      const dailyViews = this.generateDailyStats(videos);

      return {
        channelInfo,
        videoPerformance: videos,
        dailyViews,
      };
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      throw error;
    }
  }

  private generateDailyStats(videos: any[]) {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'];
    const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0);
    const avgDailyViews = Math.floor(totalViews / (7 * videos.length)) || 100;

    return days.map((name, index) => ({
      date: name,
      views: Math.floor(avgDailyViews * (0.5 + Math.random() * 1.5)),
    }));
  }
}

export default new YouTubeBackendService();
