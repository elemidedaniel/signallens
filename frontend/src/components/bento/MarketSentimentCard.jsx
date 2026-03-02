import { useState, useEffect } from 'react';
import { getFearGreedIndex } from '../../services/coinGecko';

const getsentiment = (value) => {
  if (value >= 80) return { label: 'Extreme Greed', color: 'text-green-400', bg: 'bg-green-400', ring: 'ring-green-400/30' };
  if (value >= 60) return { label: 'Greed', color: 'text-lime-400', bg: 'bg-lime-400', ring: 'ring-lime-400/30' };
  if (value >= 45) return { label: 'Neutral', color: 'text-yellow-400', bg: 'bg-yellow-400', ring: 'ring-yellow-400/30' };
  if (value >= 25) return { label: 'Fear', color: 'text-orange-400', bg: 'bg-orange-400', ring: 'ring-orange-400/30' };
  return { label: 'Extreme Fear', color: 'text-red-400', bg: 'bg-red-400', ring: 'ring-red-400/30' };
};

const MarketSentimentCard = () => {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFearGreedIndex();
        const current = result.data[0];
        setData(current);
        setHistory(result.data.slice(0, 7).reverse());
      } catch (err) {
        setError('Failed to load sentiment data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 animate-pulse">
        <div className="h-3 bg-white/10 rounded w-24 mb-4" />
        <div className="h-24 bg-white/5 rounded-xl mb-4" />
        <div className="h-3 bg-white/10 rounded w-32" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Market Sentiment</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const value = parseInt(data.value);
  const sentiment = getsentiment(value);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Fear & Greed</p>
        <span className="text-gray-500 text-xs">Live</span>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={sentiment.color}
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          {/* Value in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-black ${sentiment.color}`}>{value}</span>
          </div>
        </div>
        <p className={`text-sm font-bold mt-2 ${sentiment.color}`}>{sentiment.label}</p>
        <p className="text-gray-600 text-xs mt-1">
          {new Date(data.timestamp * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* 7 Day History */}
      <div className="mt-auto">
        <p className="text-gray-600 text-xs mb-2">7-Day History</p>
        <div className="flex items-end gap-1 h-10">
          {history.map((item, i) => {
            const v = parseInt(item.value);
            const s = getsentiment(v);
            const height = Math.max(20, (v / 100) * 100);
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1 group relative"
              >
                <div
                  className={`w-full rounded-sm ${s.bg} opacity-70 group-hover:opacity-100 transition-all`}
                  style={{ height: `${height}%` }}
                />
                {/* Tooltip */}
                <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10">
                  <div className="bg-[#0f0f17] border border-white/10 rounded-lg px-2 py-1 text-xs whitespace-nowrap">
                    <p className={`font-bold ${s.color}`}>{v} — {s.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentCard;