import { useState, useEffect } from 'react';
import { getCryptoNews } from '../../services/coinGecko';

const NewsCard = ({ currency = '' }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getCryptoNews(currency);
        setNews(data.articles?.slice(0, 6) || []);
      } catch (err) {
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [currency]);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  if (loading) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:col-span-2 xl:col-span-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Crypto News</p>
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/3 rounded-xl p-4 animate-pulse">
              <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:col-span-2 xl:col-span-2">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Crypto News</p>
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/3 border border-white/8 rounded-2xl p-6 md:col-span-2 xl:col-span-2 hover:border-white/15 transition-all">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-xs uppercase tracking-wider">
          {currency ? `${currency.toUpperCase()} News` : 'Crypto News'}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-xs">Live</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {news.map((item) => (
          <a
            key={item.id || item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-white/3 hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl p-4 transition-all group"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl">📰</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                {item.title}
              </p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                {item.description}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-gray-600 text-xs font-medium">
                  {item.source?.name}
                </span>
                <span className="text-gray-700 text-xs">•</span>
                <span className="text-gray-600 text-xs">
                  {timeAgo(item.publishedAt)}
                </span>
              </div>
            </div>

            <span className="text-gray-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-1">
              →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <p className="text-gray-600 text-xs">Powered by GNews</p>
        <a
          href="https://gnews.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-cyan-400 text-xs transition-colors"
        >
          View all news →
        </a>
      </div>
    </div>
  );
};

export default NewsCard;