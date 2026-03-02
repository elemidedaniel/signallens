import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/coins`,
});

// Get global market data
export const getGlobalData = async () => {
    const { data } = await API.get('/global');
    return data.data; // backend returns { data: { ... } }
};

// Get top coins by market cap
export const getTopCoins = async (limit = 20) => {
    const { data } = await API.get('/markets', {
        params: { limit },
    });
    return data;
};

// Get 7-day BTC chart data
export const getBTCChart = async () => {
    const { data } = await API.get('/chart');
    return data;
};

// Get 24h BTC chart data
export const getBTCChart24h = async () => {
    const { data } = await API.get('/chart24h');
    return data;
};

// Search coins
export const searchCoins = async (query) => {
    const { data } = await API.get('/search', {
        params: { query },
    });
    return data;
};

// Get individual coin details
export const getCoinDetails = async (coinId) => {
    const { data } = await API.get(`/${coinId}`);
    return data;
};

// Get individual coin chart
export const getCoinChart = async (coinId, days = 7) => {
    const { data } = await API.get(`/${coinId}/chart`, {
        params: { days },
    });
    return data;
};

// Get Fear & Greed Index
export const getFearGreedIndex = async () => {
  const { data } = await API.get('/fear-greed');
  return data;
};

// Get screener data with pagination
export const getScreenerCoins = async (page = 1, limit = 20) => {
  const { data } = await API.get('/screener', {
    params: { page, limit },
  });
  return data;
};