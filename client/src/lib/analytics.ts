// Analytics and engagement calculations

export interface VideoMetrics {
  id: string;
  title: string;
  views: number;
  likes?: number;
  comments?: number;
  publishedAt?: string;
  engagementRate?: number;
  likeRate?: number;
  commentRate?: number;
  thumbnail?: string;
  duration?: string;
  tags?: string[];
  shares?: number;
  watchTime?: number;
  avgViewDuration?: number;
  description?: string;
}

export interface ChannelMetrics {
  subscribers: number;
  views: number;
  videoCount: number;
  avgEngagementRate: number;
  avgViewsPerVideo: number;
  avgLikesPerVideo: number;
}

/**
 * Calculate engagement rate: (likes + comments) / views * 100
 */
export function calculateEngagementRate(
  views: number,
  likes: number = 0,
  comments: number = 0
): number {
  if (views === 0) return 0;
  return ((likes + comments) / views) * 100;
}

/**
 * Calculate like rate: likes / views * 100
 */
export function calculateLikeRate(views: number, likes: number): number {
  if (views === 0) return 0;
  return (likes / views) * 100;
}

/**
 * Calculate comment rate: comments / views * 100
 */
export function calculateCommentRate(views: number, comments: number): number {
  if (views === 0) return 0;
  return (comments / views) * 100;
}

/**
 * Enrich video data with engagement metrics
 */
export function enrichVideoMetrics(video: any): VideoMetrics {
  const views = video.viewCount || video.views || 0;
  const likes = video.likeCount || video.likes || 0;
  const comments = video.commentCount || video.comments || 0;

  return {
    id: video.id || '',
    title: video.title || '',
    views,
    likes,
    comments,
    publishedAt: video.publishedAt,
    thumbnail: video.thumbnail,
    duration: video.duration,
    engagementRate: calculateEngagementRate(views, likes, comments),
    likeRate: calculateLikeRate(views, likes),
    commentRate: calculateCommentRate(views, comments),
  };
}

/**
 * Sort videos by metric
 */
export function sortVideos(
  videos: VideoMetrics[],
  sortBy: 'views' | 'engagement' | 'likes' | 'comments' | 'date' = 'views',
  descending = true
): VideoMetrics[] {
  const sorted = [...videos].sort((a, b) => {
    let aVal = 0;
    let bVal = 0;

    switch (sortBy) {
      case 'views':
        aVal = a.views;
        bVal = b.views;
        break;
      case 'engagement':
        aVal = a.engagementRate || 0;
        bVal = b.engagementRate || 0;
        break;
      case 'likes':
        aVal = a.likes || 0;
        bVal = b.likes || 0;
        break;
      case 'comments':
        aVal = a.comments || 0;
        bVal = b.comments || 0;
        break;
      case 'date':
        const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        aVal = aDate || 0;
        bVal = bDate || 0;
        break;
    }

    return descending ? bVal - aVal : aVal - bVal;
  });

  return sorted;
}

/**
 * Filter videos by date range
 */
export function filterVideosByDateRange(
  videos: VideoMetrics[],
  startDate?: Date,
  endDate?: Date
): VideoMetrics[] {
  if (!startDate && !endDate) return videos;

  return videos.filter((video) => {
    if (!video.publishedAt) return false;
    const pubDate = new Date(video.publishedAt);

    if (startDate && pubDate < startDate) return false;
    if (endDate && pubDate > endDate) return false;

    return true;
  });
}

/**
 * Calculate aggregate channel metrics from video list
 */
export function calculateChannelMetrics(
  videos: VideoMetrics[],
  subscribers: number,
  viewCount: number
): ChannelMetrics {
  if (videos.length === 0) {
    return {
      subscribers,
      views: viewCount,
      videoCount: 0,
      avgEngagementRate: 0,
      avgViewsPerVideo: 0,
      avgLikesPerVideo: 0,
    };
  }

  const totalEngagement = videos.reduce((sum, v) => sum + (v.engagementRate || 0), 0);
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = videos.reduce((sum, v) => sum + (v.likes || 0), 0);

  return {
    subscribers,
    views: viewCount,
    videoCount: videos.length,
    avgEngagementRate: totalEngagement / videos.length,
    avgViewsPerVideo: totalViews / videos.length,
    avgLikesPerVideo: totalLikes / videos.length,
  };
}

/**
 * Get best and worst performing videos
 */
export function getVideoComparison(videos: VideoMetrics[]) {
  if (videos.length === 0) return { best: undefined, worst: undefined };

  const sortedByEngagement = sortVideos(videos, 'engagement', true);

  return {
    best: sortedByEngagement[0],
    worst: sortedByEngagement[sortedByEngagement.length - 1],
  };
}

/**
 * Export videos to CSV format
 */
export function exportVideosToCSV(videos: VideoMetrics[], filename: string = 'videos.csv') {
  if (videos.length === 0) return;

  const headers = [
    'Title',
    'Views',
    'Likes',
    'Comments',
    'Engagement Rate (%)',
    'Like Rate (%)',
    'Comment Rate (%)',
    'Published At',
  ];

  const rows = videos.map((v) => [
    `"${v.title.replace(/"/g, '""')}"`,
    v.views,
    v.likes || 0,
    v.comments || 0,
    (v.engagementRate || 0).toFixed(3),
    (v.likeRate || 0).toFixed(3),
    (v.commentRate || 0).toFixed(3),
    v.publishedAt || '',
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export channel metrics to CSV
 */
export function exportChannelMetricsToCSV(
  metrics: ChannelMetrics,
  channelName: string,
  filename: string = 'channel-metrics.csv'
) {
  const data = [
    ['Métrica', 'Valor'],
    ['Canal', channelName],
    ['Suscriptores', metrics.subscribers],
    ['Visualizaciones Totales', metrics.views],
    ['Cantidad de Videos', metrics.videoCount],
    ['Engagement Rate Promedio (%)', metrics.avgEngagementRate.toFixed(3)],
    ['Vistas Promedio por Video', Math.round(metrics.avgViewsPerVideo)],
    ['Likes Promedio por Video', Math.round(metrics.avgLikesPerVideo)],
    ['Fecha de Exportación', new Date().toLocaleString('es-ES')],
  ];

  const csv = data.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Get growth trend data for the last N days/weeks
 */
export function generateTrendData(
  videos: VideoMetrics[],
  period: 'weekly' | 'monthly' = 'weekly'
): any[] {
  // Generate a contiguous period map (last N weeks or months) and aggregate views
  const now = new Date();
  const map = new Map<string, number>();

  if (period === 'weekly') {
    // Build last 12 weeks
    const weeks = 12;
    for (let i = weeks - 1; i >= 0; i--) {
      const wStart = new Date(now);
      wStart.setDate(now.getDate() - i * 7 - wStart.getDay());
      const key = wStart.toISOString().split('T')[0];
      map.set(key, 0);
    }

    videos.forEach((video) => {
      if (!video.publishedAt) return;
      const pub = new Date(video.publishedAt);
      if (isNaN(pub.getTime())) return;
      // Find week start for this date
      const weekStart = new Date(pub);
      weekStart.setDate(pub.getDate() - pub.getDay());
      const key = weekStart.toISOString().split('T')[0];
      if (map.has(key)) map.set(key, (map.get(key) || 0) + (video.views || 0));
    });
  } else {
    // monthly - last 12 months
    const months = 12;
    for (let i = months - 1; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, 0);
    }

    videos.forEach((video) => {
      if (!video.publishedAt) return;
      const pub = new Date(video.publishedAt);
      if (isNaN(pub.getTime())) return;
      const key = `${pub.getFullYear()}-${String(pub.getMonth() + 1).padStart(2, '0')}`;
      if (map.has(key)) map.set(key, (map.get(key) || 0) + (video.views || 0));
    });
  }

  return Array.from(map.entries()).map(([period, views]) => ({ period, views: views || 0, date: period }));
}
