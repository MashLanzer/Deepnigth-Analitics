import axios from 'axios';

const API_KEY = 'AIzaSyAPM9WeKXZTxfg3q5tNysdiFxjV1ZagUyQ';
const CHANNEL_ID = 'UCIlucAowvh8GUqsysgbpeMg';

async function run() {
  try {
    const ch = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: { key: API_KEY, id: CHANNEL_ID, part: 'snippet,statistics,contentDetails' }
    });

    if (!ch.data.items || ch.data.items.length === 0) {
      console.error('Channel not found');
      process.exit(1);
    }

    const channel = ch.data.items[0];
    console.log('Channel title:', channel.snippet.title);
    console.log('Subscribers:', channel.statistics.subscriberCount);
    console.log('Views:', channel.statistics.viewCount);

    const uploads = channel.contentDetails.relatedPlaylists.uploads;
    const playlist = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: { key: API_KEY, playlistId: uploads, part: 'snippet,contentDetails', maxResults: 5 }
    });

    const ids = playlist.data.items.map(i => i.contentDetails.videoId).join(',');
    const details = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: { key: API_KEY, id: ids, part: 'snippet,statistics,contentDetails' }
    });

    console.log('Top videos:');
    details.data.items.forEach((v) => {
      console.log('-', v.id, v.snippet.title, 'views:', v.statistics.viewCount || 0);
    });
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

run();
