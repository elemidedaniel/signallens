import { useState, useEffect } from 'react';
import { getGlobalData } from '../../services/coinGecko';

const MarketOverviewCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const global = await getGlobalData();
        setData(global);
      } catch (err) {
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="md:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Market Overview</p>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/3 rounded-xl p-3 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-2/3 mb-2" />
              <div className="h-6 bg-white/10 rounded w-1/2 mb-1" />
              <div className="h-3 bg-white/10 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Market Overview</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const marketCapChange = data?.market_cap_change_percentage_24h_usd;

  const stats = [
    {
      label: 'Total Market Cap',
      value: formatNumber(data?.total_market_cap?.usd || 0),
      change: `${marketCapChange?.toFixed(2)}%`,
      positive: marketCapChange > 0,
    },
    {
      label: 'BTC Dominance',
      value: `${data?.market_cap_percentage?.btc?.toFixed(1)}%`,
      change: 'Dominance',
      positive: true,
    },
    {
      label: '24h Volume',
      value: formatNumber(data?.total_volume?.usd || 0),
      change: 'Total',
      positive: true,
    },
    {
      label: 'Active Coins',
      value: data?.active_cryptocurrencies?.toLocaleString(),
      change: 'Tracked',
      positive: true,
    },
  ];

  return (
    <div className="md:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider">Market Overview</p>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-xs">Live</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="bg-white/3 rounded-xl p-3">
            <p className="text-gray-500 text-xs mb-1">{item.label}</p>
            <p className="text-white font-bold text-lg">{item.value}</p>
            <p className={`text-xs mt-1 ${item.positive ? 'text-green-400' : 'text-red-400'}`}>
              {item.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketOverviewCard;