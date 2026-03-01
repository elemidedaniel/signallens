import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../../context/WatchlistContext';
import { getTopCoins } from '../../services/coinGecko';

const WatchlistCard = () => {
  const navigate = useNavigate();
  const { watchlist, removeCoin } = useWatchlist();
  const [liveData, setLiveData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveData = async () => {
      if (watchlist.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const coins = await getTopCoins(100);
        const mapped = {};
        coins.forEach((coin) => {
          mapped[coin.id] = coin;
        });
        setLiveData(mapped);
      } catch (err) {
        console.error('Failed to fetch watchlist prices');
      } finally {
        setLoading(false);
      }
    };
    fetchLiveData();
  }, [watchlist]);

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <p className="text-gray-500 text-xs uppercase tracking-wider">My Watchlist</p>
        <span className="text-cyan-400 text-xs bg-cyan-400/10 px-2 py-1 rounded-lg">
          {watchlist.length} coins
        </span>
      </div>

      {/* Empty State */}
      {watchlist.length === 0 && (
        <div className="flex flex-col items-center justify-center h-32 border border-dashed border-white/10 rounded-xl gap-2">
          <span className="text-2xl">🎯</span>
          <p className="text-gray-500 text-xs text-center">
            Search and add coins
            <br />
            to your watchlist
          </p>
        </div>
      )}

      {/* Scrollable Watchlist */}
      {watchlist.length > 0 && (
        <div className="overflow-y-auto max-h-[220px] flex flex-col gap-2 pr-1
          scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10
          hover:scrollbar-thumb-white/20">
          {loading ? (
            [...Array(watchlist.length)].map((_, i) => (
              <div
                key={i}
                className="bg-white/3 rounded-xl p-3 animate-pulse h-12 flex-shrink-0"
              />
            ))
          ) : (
            watchlist.map((item) => {
              const live = liveData[item.coinId];
              return (
                <div
                  key={item.coinId}
                  onClick={() => navigate(`/coin/${item.coinId}`)}
                  className="flex items-center justify-between bg-white/3 hover:bg-white/5 border border-transparent hover:border-cyan-500/20 rounded-xl p-3 transition-all group flex-shrink-0 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-6 h-6 rounded-full flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {item.symbol.toUpperCase()}
                      </p>
                      <p className="text-gray-500 text-xs">{item.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {live && (
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">
                          ${live.current_price.toLocaleString()}
                        </p>
                        <p
                          className={`text-xs ${
                            live.price_change_percentage_24h > 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {live.price_change_percentage_24h > 0 ? '+' : ''}
                          {live.price_change_percentage_24h?.toFixed(2)}%
                        </p>
                      </div>
                    )}
                    {/* Remove Button — stop propagation so click doesn't navigate */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCoin(item.coinId);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default WatchlistCard;