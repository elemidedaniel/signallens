import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { getScreenerCoins } from '../services/coinGecko';
import { useWatchlist } from '../context/WatchlistContext';
import { getSignal } from '../utils/signalLogic';

const Markets = () => {
  const navigate = useNavigate();
  const { addCoin, removeCoin, isWatchlisted } = useWatchlist();

  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await getScreenerCoins(page, 20);
        setCoins(data);
      } catch (err) {
        setError('Failed to load market data');
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [page]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  const handleWatchlist = async (e, coin) => {
    e.stopPropagation();
    if (isWatchlisted(coin.id)) {
      await removeCoin(coin.id);
    } else {
      await addCoin({
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image,
      });
    }
  };

  const filtered = coins
    .filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortBy] ?? 0;
      const valB = b[sortBy] ?? 0;
      return sortDir === 'desc' ? valB - valA : valA - valB;
    });

  const SortIcon = ({ field }) => (
    <span className={`ml-1 text-xs ${sortBy === field ? 'text-cyan-400' : 'text-gray-600'}`}>
      {sortBy === field ? (sortDir === 'desc' ? '▼' : '▲') : '▼'}
    </span>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      <Sidebar />

      <main className="lg:ml-60 pt-16 pb-20 lg:pb-6 px-6 min-h-screen">
        <div className="max-w-6xl mx-auto py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Markets</h1>
              <p className="text-gray-500 text-sm mt-1">
                Full crypto market screener — {(page - 1) * 20 + 1} to {page * 20}
              </p>
            </div>
            <div className="relative w-full md:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter coins..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/30 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/3 border border-white/8 rounded-2xl">
            {/* Scrollable area */}
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider min-w-[700px]">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Coin</div>
                <div
                  className="col-span-2 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('current_price')}
                >
                  Price <SortIcon field="current_price" />
                </div>
                <div
                  className="col-span-2 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('price_change_percentage_24h')}
                >
                  24h <SortIcon field="price_change_percentage_24h" />
                </div>
                <div
                  className="col-span-2 text-right cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('market_cap')}
                >
                  Market Cap <SortIcon field="market_cap" />
                </div>
                <div className="col-span-2 text-right">Signal / Watch</div>
              </div>

              {/* Loading */}
              {loading && (
                <div className="flex flex-col gap-0 min-w-[700px]">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/3 animate-pulse">
                      <div className="col-span-1 h-4 bg-white/5 rounded" />
                      <div className="col-span-3 h-4 bg-white/5 rounded" />
                      <div className="col-span-2 h-4 bg-white/5 rounded" />
                      <div className="col-span-2 h-4 bg-white/5 rounded" />
                      <div className="col-span-2 h-4 bg-white/5 rounded" />
                      <div className="col-span-2 h-4 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="px-6 py-12 text-center min-w-[700px]">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Coins */}
              {!loading && !error && (
                <div className="flex flex-col min-w-[700px]">
                  {filtered.map((coin, index) => {
                    const signal = getSignal({
                      price_change_24h: coin.price_change_percentage_24h,
                      total_volume: coin.total_volume,
                      market_cap: coin.market_cap,
                    });
                    const isUp = coin.price_change_percentage_24h > 0;
                    const watched = isWatchlisted(coin.id);

                    return (
                      <div
                        key={coin.id}
                        onClick={() => navigate(`/coin/${coin.id}`)}
                        className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/3 hover:bg-white/3 transition-all cursor-pointer group"
                      >
                        <div className="col-span-1 flex items-center">
                          <span className="text-gray-600 text-sm">{(page - 1) * 20 + index + 1}</span>
                        </div>
                        <div className="col-span-3 flex items-center gap-3">
                          <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                          <div>
                            <p className="text-white text-sm font-semibold">{coin.name}</p>
                            <p className="text-gray-500 text-xs">{coin.symbol.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <p className="text-white text-sm font-semibold">${coin.current_price.toLocaleString()}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${isUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                            {isUp ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                          </span>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <p className="text-gray-400 text-sm">${(coin.market_cap / 1e9).toFixed(2)}B</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <span className={`text-xs px-2 py-1 rounded-lg ${signal.bg} ${signal.color} ${signal.border} border`}>
                            {signal.label}
                          </span>
                          <button
                            onClick={(e) => handleWatchlist(e, coin)}
                            className={`text-xs px-2 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                              watched
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 opacity-0 group-hover:opacity-100'
                            }`}
                          >
                            {watched ? '✓' : '+'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination — outside scroll */}
            {!loading && !error && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white text-sm px-4 py-2 rounded-xl transition-all"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm transition-all ${
                        page === i + 1
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                          : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <span className="text-gray-600 text-sm">...</span>
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm px-4 py-2 rounded-xl transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Markets;