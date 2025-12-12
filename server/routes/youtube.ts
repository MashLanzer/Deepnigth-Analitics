import express, { Router } from 'express';
import youtubeService from '../services/youtubeService.js';

const router = Router();

// Get channel stats
router.get('/channel-stats', async (req, res) => {
  try {
    const { channelId } = req.query;
    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }
    const stats = await youtubeService.getChannelStats(channelId as string);
    res.json(stats);
  } catch (error: any) {
    console.error('Error in channel-stats route:', error.message || error);
    res.status(500).json({ 
      error: 'Failed to fetch channel stats',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// Get channel info
router.get('/channel-info', async (req, res) => {
  try {
    const { channelId } = req.query;
    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }
    const info = await youtubeService.getChannelInfo(channelId as string);
    res.json(info);
  } catch (error) {
    console.error('Error in channel-info route:', error);
    res.status(500).json({ error: 'Failed to fetch channel info' });
  }
});

// Get top videos
router.get('/top-videos', async (req, res) => {
  try {
    const { channelId, limit = '10' } = req.query;
    if (!channelId) {
      return res.status(400).json({ error: 'channelId is required' });
    }
    const videos = await youtubeService.getChannelVideos(
      channelId as string,
      parseInt(limit as string)
    );
    res.json(videos);
  } catch (error) {
    console.error('Error in top-videos route:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get video analytics
router.get('/video-analytics', async (req, res) => {
  try {
    const { videoId } = req.query;
    if (!videoId) {
      return res.status(400).json({ error: 'videoId is required' });
    }
    // This would fetch detailed analytics for a specific video
    res.json({ message: 'Video analytics endpoint' });
  } catch (error) {
    console.error('Error in video-analytics route:', error);
    res.status(500).json({ error: 'Failed to fetch video analytics' });
  }
});

export default router;
