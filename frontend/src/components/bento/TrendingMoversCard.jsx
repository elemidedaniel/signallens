import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopCoins } from '../../services/coinGecko';
import { getSignal } from '../../utils/signalLogic';

const TrendingMoversCard = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('gainers');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const data = await getTopCoins(20);
        setCoins(data);
      } catch (err) {
        setError('Failed to load trending data');
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const gainers = [...coins]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 4);

  const losers = [...coins]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 4);

  const displayed = filter === 'gainers' ? gainers : losers;

  if (loading) {
    return (
      <div className="md:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Trending Movers</p>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/3 rounded-xl p-3 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/2 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Trending Movers</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Trending Movers</p>
        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setFilter('gainers')}
            className={`text-xs px-3 py-1 rounded-md transition-all ${
              filter === 'gainers'
                ? 'bg-green-500/20 text-green-400'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setFilter('losers')}
            className={`text-xs px-3 py-1 rounded-md transition-all ${
              filter === 'losers'
                ? 'bg-red-500/20 text-red-400'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            Losers
          </button>
        </div>
      </div>

      {/* Coins Grid */}
      <div className="grid grid-cols-2 gap-3">
        {displayed.map((coin) => {
          const signal = getSignal({
            price_change_24h: coin.price_change_percentage_24h,
            total_volume: coin.total_volume,
            market_cap: coin.market_cap,
          });

          return (
            <div
              key={coin.id}
              onClick={() => navigate(`/coin/${coin.id}`)}
              className="bg-white/3 hover:bg-white/5 border border-transparent hover:border-cyan-500/20 rounded-xl p-3 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <p className="text-white text-sm font-semibold">
                    {coin.symbol.toUpperCase()}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{coin.name}</p>
                </div>
              </div>
              <p className="text-white font-bold text-sm">
                ${coin.current_price.toLocaleString()}
              </p>
              <div className="flex items-center justify-between mt-1">
                <p
                  className={`text-xs font-semibold ${
                    coin.price_change_percentage_24h > 0
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}
                >
                  {coin.price_change_percentage_24h > 0 ? '+' : ''}
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${signal.bg} ${signal.color}`}>
                  {signal.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingMoversCard;