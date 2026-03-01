import { createContext, useContext, useState, useEffect } from 'react';
import { addToWatchlist, removeFromWatchlist } from '../services/api';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  // Sync watchlist with user data
  useEffect(() => {
    if (user) {
      setWatchlist(user.watchlist || []);
    } else {
      setWatchlist([]);
    }
  }, [user]);

  // Add coin to watchlist
  const addCoin = async (coin) => {
    try {
      const { data } = await addToWatchlist(coin);
      setWatchlist(data.watchlist);
      updateUser({ watchlist: data.watchlist });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add coin',
      };
    }
  };

  // Remove coin from watchlist
  const removeCoin = async (coinId) => {
    try {
      const { data } = await removeFromWatchlist(coinId);
      setWatchlist(data.watchlist);
      updateUser({ watchlist: data.watchlist });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to remove coin',
      };
    }
  };

  // Check if coin is already in watchlist
  const isWatchlisted = (coinId) => {
    return watchlist.some((item) => item.coinId === coinId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addCoin, removeCoin, isWatchlisted }}>
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom hook for easy access
export const useWatchlist = () => useContext(WatchlistContext);