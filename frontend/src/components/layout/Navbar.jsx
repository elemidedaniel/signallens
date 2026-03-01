import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { searchCoins } from '../../services/coinGecko';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { addCoin, isWatchlisted } = useWatchlist();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchResults([]);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchCoins(searchQuery);
        setSearchResults(results);
        setSearchOpen(true);
      } catch (err) {
        console.error('Search failed');
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddToWatchlist = async (coin) => {
    await addCoin({
      coinId: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      image: coin.large || coin.thumb || '',
    });
    setSearchQuery('');
    setSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
      <div className="flex items-center justify-between px-6 py-4 gap-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SL</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden md:block">
            Signal<span className="text-cyan-400">Lens</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coins..."
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/30 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 outline-none transition-all text-sm"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Search Dropdown */}
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-[#0f0f17] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
              {searchResults.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all"
                >
                  {/* Coin Info */}
                  <div className="flex items-center gap-3">
                    {coin.large || coin.thumb ? (
                      <img
                        src={coin.thumb}
                        alt={coin.name}
                        className="w-7 h-7 rounded-full"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {coin.symbol?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white text-sm font-semibold">{coin.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          {coin.symbol?.toUpperCase()}
                        </span>
                        {coin.market_cap_rank && (
                          <span className="text-gray-600 text-xs">
                            #{coin.market_cap_rank}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add to Watchlist Button */}
                  <button
                    onClick={() => handleAddToWatchlist(coin)}
                    disabled={isWatchlisted(coin.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all flex-shrink-0 ${
                      isWatchlisted(coin.id)
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-default'
                        : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {isWatchlisted(coin.id) ? '✓ Added' : '+ Watch'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/dashboard"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Watchlist
            </Link>
          </div>

          {/* Live Badge */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>

          {/* Profile Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-all"
            >
              {user?.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-white text-sm font-medium hidden md:block">
                {user?.fullName?.split(' ')[0]}
              </span>
              <span className="text-gray-500 text-xs">▾</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-56 bg-[#0f0f17] border border-white/10 rounded-2xl p-2 shadow-2xl">
                {/* User Info */}
                <div className="px-3 py-2 mb-1 border-b border-white/5">
                  <p className="text-white text-sm font-semibold">{user?.fullName}</p>
                  <p className="text-cyan-400 text-xs">{user?.userId}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white text-sm transition-all"
                >
                  <span>👤</span> View Profile
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white text-sm transition-all"
                >
                  <span>✏️</span> Edit Profile
                </Link>

                <div className="border-t border-white/5 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-gray-300 hover:text-red-400 text-sm transition-all"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;