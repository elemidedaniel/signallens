import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MarketOverviewCard from '../components/bento/MarketOverviewCard';
import TrendingMoversCard from '../components/bento/TrendingMoversCard';
import MarketChartCard from '../components/bento/MarketChartCard';
import WatchlistCard from '../components/bento/WatchlistCard';
import { useAuth } from '../context/AuthContext';
import { getSignal } from '../utils/signalLogic';
import { getTopCoins } from '../services/coinGecko';

const Dashboard = () => {
  const { user } = useAuth();
  const [signals, setSignals] = useState({ momentum: 0, volatile: 0, spike: 0, neutral: 0 });
  const [volumeSpikes, setVolumeSpikes] = useState([]);
  const [sentiment] = useState(72);
  const [loadingSignals, setLoadingSignals] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const coins = await getTopCoins(50);
        let momentum = 0, volatile = 0, spike = 0, neutral = 0;
        const spikes = [];

        coins.forEach((coin) => {
          const signal = getSignal({
            price_change_24h: coin.price_change_percentage_24h,
            total_volume: coin.total_volume,
            market_cap: coin.market_cap,
          });

          if (signal.label === 'Strong Momentum') momentum++;
          else if (signal.label === 'High Volatility') volatile++;
          else if (signal.label === 'Volume Spike') spike++;
          else neutral++;

          // Collect volume spikes
          const volumeRatio = coin.total_volume / coin.market_cap;
          if (volumeRatio > 0.15) {
            spikes.push({
              coin: coin.symbol.toUpperCase(),
              spike: `+${(volumeRatio * 100).toFixed(0)}%`,
            });
          }
        });

        setSignals({ momentum, volatile, spike, neutral });
        setVolumeSpikes(spikes.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch signals');
      } finally {
        setLoadingSignals(false);
      }
    };
    fetchSignals();
  }, []);

  // Get member since date
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="lg:ml-60 pt-16 pb-20 lg:pb-6 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto py-8">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Welcome back, {user?.fullName?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Here's what the market is doing right now.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-medium">Markets Live</span>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {/* Row 1 */}
            {/* Market Overview - spans 2 cols */}
            <MarketOverviewCard />

            {/* Signal Summary */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Signal Summary</p>
              {loadingSignals ? (
                <div className="flex flex-col gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Strong Momentum', count: signals.momentum, color: 'text-green-400 bg-green-400/10' },
                    { label: 'High Volatility', count: signals.volatile, color: 'text-red-400 bg-red-400/10' },
                    { label: 'Volume Spike', count: signals.spike, color: 'text-yellow-400 bg-yellow-400/10' },
                    { label: 'Neutral', count: signals.neutral, color: 'text-gray-400 bg-gray-400/10' },
                  ].map((signal) => (
                    <div key={signal.label} className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${signal.color}`}>
                        {signal.label}
                      </span>
                      <span className="text-white font-bold text-sm">{signal.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Volume Spikes */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Volume Spikes</p>
              {loadingSignals ? (
                <div className="flex flex-col gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : volumeSpikes.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {volumeSpikes.map((item) => (
                    <div key={item.coin} className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm font-medium">{item.coin}</span>
                      <span className="text-yellow-400 text-xs font-bold bg-yellow-400/10 px-2 py-1 rounded-lg">
                        {item.spike}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No spikes detected</p>
              )}
            </div>

            {/* Row 2 */}
            {/* BTC Chart - spans 3 cols */}
            <MarketChartCard />

            {/* Watchlist Card */}
            <WatchlistCard />

            {/* Row 3 */}
            {/* Trending Movers - spans 2 cols */}
            <TrendingMoversCard />

            {/* User Stats */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Your Stats</p>
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Watchlist', value: `${user?.watchlist?.length || 0} coins` },
                  { label: 'Signals Today', value: signals.momentum + signals.volatile + signals.spike },
                  { label: 'Member Since', value: memberSince },
                  { label: 'Trader ID', value: user?.userId },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-gray-500 text-xs">{stat.label}</span>
                    <span className="text-white text-sm font-semibold truncate max-w-[120px] text-right">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Sentiment */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Market Sentiment</p>
              <div className="flex flex-col items-center justify-center gap-3">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center border-2 ${
                    sentiment > 60
                      ? 'bg-green-400/20 border-green-400/30'
                      : sentiment > 40
                      ? 'bg-yellow-400/20 border-yellow-400/30'
                      : 'bg-red-400/20 border-red-400/30'
                  }`}
                >
                  <span
                    className={`font-black text-2xl ${
                      sentiment > 60
                        ? 'text-green-400'
                        : sentiment > 40
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {sentiment}
                  </span>
                </div>
                <p
                  className={`font-bold text-sm ${
                    sentiment > 60
                      ? 'text-green-400'
                      : sentiment > 40
                      ? 'text-yellow-400'
                      : 'text-red-400'
                  }`}
                >
                  {sentiment > 60 ? 'Greed' : sentiment > 40 ? 'Neutral' : 'Fear'}
                </p>
                <p className="text-gray-500 text-xs text-center">Fear & Greed Index</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;