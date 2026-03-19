module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server is missing YOUTUBE_API_KEY' });
    }

    const rawHandle = typeof req.query.handle === 'string' ? req.query.handle : '';
    const providedChannelId = typeof req.query.channelId === 'string' ? req.query.channelId : '';
    const maxResults = Math.min(Math.max(Number.parseInt(req.query.maxResults || '3', 10), 1), 10);

    try {
        let channelId = providedChannelId;

        if (!channelId) {
            const handle = rawHandle.replace('@', '').trim();
            if (!handle) {
                return res.status(400).json({ error: 'Provide handle or channelId' });
            }

            const channelLookupUrl =
                `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${encodeURIComponent(handle)}&key=${encodeURIComponent(apiKey)}`;
            const channelLookupResponse = await fetch(channelLookupUrl);

            if (!channelLookupResponse.ok) {
                return res.status(channelLookupResponse.status).json({
                    error: 'Failed to resolve YouTube channel from handle',
                });
            }

            const channelLookupData = await channelLookupResponse.json();
            channelId = channelLookupData?.items?.[0]?.id || '';

            if (!channelId) {
                return res.status(404).json({ error: 'Channel not found for handle' });
            }
        }

        const videosUrl =
            `https://www.googleapis.com/youtube/v3/search?key=${encodeURIComponent(apiKey)}&channelId=${encodeURIComponent(channelId)}&part=snippet,id&order=date&maxResults=${maxResults}&type=video`;

        const videosResponse = await fetch(videosUrl);

        if (!videosResponse.ok) {
            return res.status(videosResponse.status).json({ error: 'Failed to fetch videos from YouTube' });
        }

        const videosData = await videosResponse.json();

        const items = (videosData.items || []).map((video) => ({
            id: { videoId: video?.id?.videoId || '' },
            snippet: {
                title: video?.snippet?.title || '',
                publishedAt: video?.snippet?.publishedAt || '',
                thumbnails: video?.snippet?.thumbnails || {},
            },
        }));

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
        return res.status(200).json({ items, channelId });
    } catch (error) {
        return res.status(500).json({ error: 'Unexpected server error' });
    }
};
