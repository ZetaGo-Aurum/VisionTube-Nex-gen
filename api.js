const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;  // Use process.env
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Proxy endpoint untuk YouTube API
app.get('/api', async (req, res) => {
    const { endpoint, ...params } = req.query;
    if (!endpoint) {
        return res.status(400).json({ error: 'Endpoint is required' });
    }

    const url = `${YOUTUBE_API_BASE_URL}${endpoint}`;
    const allParams = { ...params, key: YOUTUBE_API_KEY };

    try {
        const response = await axios.get(url, { params: allParams });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from YouTube API:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
