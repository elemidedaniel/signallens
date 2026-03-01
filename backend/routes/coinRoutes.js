const express = require('express');
const router = express.Router();
const axios = require('axios');

const COINGECKO = 'https://api.coingecko.com/api/v3';

// Cache durations
const CACHE_DURATION = 120 * 1000;        // 2 minutes fresh
const CACHE_DURATION_CHART = 300 * 1000;  // 5 minutes fresh
const STALE_DURATION = 30 * 60 * 1000;   // 30 minutes stale (serve if fresh fetch fails)

const cache = {};

// Get from cache — returns fresh, stale, or null
const getFromCache = (key) => {
    const entry = cache[key];
    if (!entry) return { data: null, isStale: false };
    const age = Date.now() - entry.timestamp;
    const isFresh = age < (entry.chartDuration || CACHE_DURATION);
    const isStale = !isFresh && age < STALE_DURATION;
    return { data: entry.data, isFresh, isStale };
};

const setCache = (key, data, chartDuration = null) => {
    if (data) {
        cache[key] = { data, timestamp: Date.now(), chartDuration };
    }
};

const clearCache = (key) => delete cache[key];

// Proxy helper with retry + exponential backoff
const fetchCoinGecko = async (endpoint, params = {}, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const { data } = await axios.get(`${COINGECKO}${endpoint}`, {
                params,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'SignalLens/1.0',
                },
                timeout: 15000,
            });
            return data;
        } catch (error) {
            const is429 = error.response?.status === 429;
            const isLast = attempt === retries;

            if (isLast) throw error;

            // Exponential backoff: 2s, 4s, 8s
            const delay = is429 ? attempt * 2000 : 1000;
            console.log(`⚠️ Attempt ${attempt} failed. Retrying in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

// Smart fetch — tries fresh, falls back to stale cache on failure
const smartFetch = async (key, fetchFn, chartDuration = null) => {
    const { data: cachedData, isFresh, isStale } = getFromCache(key);

    // Return fresh cache immediately
    if (isFresh) {
        console.log(`✅ Fresh cache: ${key}`);
        return cachedData;
    }

    try {
        console.log(`🌐 Fetching: ${key}`);
        const freshData = await fetchFn();
        setCache(key, freshData, chartDuration);
        return freshData;
    } catch (error) {
        // If fetch fails but we have stale data, serve it
        if (isStale) {
            console.log(`⚡ Serving stale cache: ${key}`);
            return cachedData;
        }
        throw error;
    }
};

// @route GET /api/coins/global
router.get('/global', async (req, res) => {
    try {
        const data = await smartFetch('global', () => fetchCoinGecko('/global'));
        res.json(data);
    } catch (error) {
        console.error('Global error:', error.message);
        res.status(500).json({ message: 'Failed to fetch global data' });
    }
});

// @route GET /api/coins/markets
router.get('/markets', async (req, res) => {
    try {
        const limit = req.query.limit || 20;
        const data = await smartFetch(`markets_${limit}`, () =>
            fetchCoinGecko('/coins/markets', {
                vs_currency: 'usd',
                order: 'market_cap_desc',
                per_page: limit,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h',
            })
        );
        res.json(data);
    } catch (error) {
        console.error('Markets error:', error.message);
        res.status(500).json({ message: 'Failed to fetch markets data' });
    }
});

// @route GET /api/coins/chart
router.get('/chart', async (req, res) => {
    try {
        const data = await smartFetch(
            'chart',
            () => fetchCoinGecko('/coins/bitcoin/market_chart', {
                vs_currency: 'usd',
                days: 7,
            }),
            CACHE_DURATION_CHART
        );
        res.json(data);
    } catch (error) {
        console.error('Chart error:', error.message);
        res.status(500).json({ message: 'Failed to fetch chart data' });
    }
});

// @route GET /api/coins/chart24h
router.get('/chart24h', async (req, res) => {
    try {
        const now = Date.now();
        const { data: cachedData, isFresh, isStale } = getFromCache('chart24h');

        if (isFresh) {
            console.log('✅ Fresh cache: chart24h');
            return res.json(cachedData);
        }

        // Delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            const data = await fetchCoinGecko('/coins/bitcoin/market_chart', {
                vs_currency: 'usd',
                days: 1,
            });
            setCache('chart24h', data, CACHE_DURATION_CHART);
            res.json(data);
        } catch (error) {
            if (isStale) {
                console.log('⚡ Serving stale cache: chart24h');
                return res.json(cachedData);
            }
            throw error;
        }
    } catch (error) {
        console.error('Chart24h error:', error.message);
        res.status(500).json({ message: 'Failed to fetch 24h chart data' });
    }
});

// @route GET /api/coins/search
router.get('/search', async (req, res) => {
    try {
        const query = req.query.query;
        const data = await smartFetch(`search_${query}`, () =>
            fetchCoinGecko('/search', { query })
        );
        res.json(data.coins.slice(0, 8));
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ message: 'Failed to search coins' });
    }
});

// @route GET /api/coins/:coinId
router.get('/:coinId', async (req, res) => {
    try {
        const { coinId } = req.params;
        const { data: cachedData, isFresh, isStale } = getFromCache(`coin_${coinId}`);

        if (isFresh) {
            console.log(`✅ Fresh cache: coin_${coinId}`);
            return res.json(cachedData);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));

        try {
            const data = await fetchCoinGecko(`/coins/${coinId}`, {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
            });
            setCache(`coin_${coinId}`, data, CACHE_DURATION_CHART);
            res.json(data);
        } catch (error) {
            if (isStale) {
                console.log(`⚡ Serving stale cache: coin_${coinId}`);
                return res.json(cachedData);
            }
            throw error;
        }
    } catch (error) {
        console.error('Coin detail error:', error.message);
        res.status(500).json({ message: 'Failed to fetch coin data' });
    }
});

// @route GET /api/coins/:coinId/chart
router.get('/:coinId/chart', async (req, res) => {
    try {
        const { coinId } = req.params;
        const days = req.query.days || 7;
        const cacheKey = `coin_chart_${coinId}_${days}`;
        const { data: cachedData, isFresh, isStale } = getFromCache(cacheKey);

        if (isFresh) {
            console.log(`✅ Fresh cache: ${cacheKey}`);
            return res.json(cachedData);
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const data = await fetchCoinGecko(`/coins/${coinId}/market_chart`, {
                vs_currency: 'usd',
                days,
            });
            setCache(cacheKey, data, CACHE_DURATION_CHART);
            res.json(data);
        } catch (error) {
            if (isStale) {
                console.log(`⚡ Serving stale cache: ${cacheKey}`);
                return res.json(cachedData);
            }
            throw error;
        }
    } catch (error) {
        console.error('Coin chart error:', error.message);
        res.status(500).json({ message: 'Failed to fetch coin chart' });
    }
});

module.exports = router;