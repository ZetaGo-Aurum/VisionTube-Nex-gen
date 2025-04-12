const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';

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

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log('✅ Server ready!');
    // Tambahin ini 👇
    if (process.send) {
        process.send('ready'); // Kirim pesan ke Vercel kalo server udah siap
    }
});

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

