import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import NewsCard from '../components/bento/NewsCard';
import AIAnalysisCard from '../components/bento/AIAnalysisCard';
import { getCoinDetails, getCoinChart } from '../services/coinGecko';
import { useWatchlist } from '../context/WatchlistContext';
import { getSignal } from '../utils/signalLogic';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const price = payload[0].value;
    const open = payload[0].payload.open;
    const change = open ? (((price - open) / open) * 100).toFixed(2) : null;
    const isUp = parseFloat(change) >= 0;
    return (
      <div className="bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-white font-black text-base">${price.toLocaleString()}</p>
        <p className="text-gray-500 text-xs mt-0.5">{payload[0].payload.date}</p>
        {change && (
          <p className={`text-xs font-semibold mt-1 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {isUp ? '▲' : '▼'} {Math.abs(change)}% from open
          </p>
        )}
      </div>
    );
  }
  return null;
};

const StatBox = ({ label, value, sub, colored, isPositive }) => (
  <div className="flex flex-col gap-0.5 min-w-[100px]">
    <p className="text-gray-600 text-xs uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-bold ${colored ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
      {value}
    </p>
    {sub && <p className="text-gray-600 text-xs">{sub}</p>}
  </div>
);

const CoinDetail = () => {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const { addCoin, removeCoin, isWatchlisted } = useWatchlist();
  const chartScrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('7');
  const [priceChange, setPriceChange] = useState(null);
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);
  const [openPrice, setOpenPrice] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        setLoading(true);
        const data = await getCoinDetails(coinId);
        setCoin(data);
      } catch (err) {
        setError('Failed to load coin data');
      } finally {
        setLoading(false);
      }
    };
    fetchCoin();
  }, [coinId]);

  useEffect(() => {
    if (!coin) return;
    const fetchChart = async () => {
      try {
        setChartLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = await getCoinChart(coinId, timeframe);
        const formatted = data.prices.map(([timestamp, price]) => ({
          date: timeframe === '1'
            ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Math.round(price),
          open: Math.round(data.prices[0][1]),
        }));
        setChartData(formatted);

        const prices = formatted.map((d) => d.price);
        const first = prices[0];
        const last = prices[prices.length - 1];
        setPriceChange((((last - first) / first) * 100).toFixed(2));
        setHigh(Math.max(...prices));
        setLow(Math.min(...prices));
        setOpenPrice(first);
      } catch (err) {
        console.error('Chart fetch failed');
      } finally {
        setChartLoading(false);
      }
    };
    fetchChart();
  }, [coin, timeframe]);

  const handleWatchlist = async () => {
    if (isWatchlisted(coinId)) {
      await removeCoin(coinId);
    } else {
      await addCoin({
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        image: coin.image?.large || '',
      });
    }
  };

  // Drag to scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - chartScrollRef.current.offsetLeft);
    setScrollLeft(chartScrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - chartScrollRef.current.offsetLeft;
    chartScrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };
  const handleMouseUp = () => setIsDragging(false);

  const isPositive = parseFloat(priceChange) >= 0;
  const strokeColor = isPositive ? '#22d3ee' : '#f87171';
  const changeAbs = Math.abs(priceChange);
  const changeDollar = openPrice && coin?.market_data?.current_price?.usd
    ? Math.abs(coin.market_data.current_price.usd - openPrice)
    : null;

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <Navbar />
        <Sidebar />
        <main className="lg:ml-60 pt-16 pb-20 lg:pb-6 px-6">
          <div className="max-w-5xl mx-auto py-8 animate-pulse flex flex-col gap-6">
            <div className="h-8 bg-white/5 rounded w-48" />
            <div className="h-32 bg-white/5 rounded-2xl" />
            <div className="h-64 bg-white/5 rounded-2xl" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="text-cyan-400 hover:text-cyan-300 text-sm">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const marketData = coin?.market_data;
  const price = marketData?.current_price?.usd;
  const priceChange24h = marketData?.price_change_percentage_24h;
  const priceChange7d = marketData?.price_change_percentage_7d;

  const signal = getSignal({
    price_change_24h: priceChange24h,
    total_volume: marketData?.total_volume?.usd,
    market_cap: marketData?.market_cap?.usd,
  });

  const timeframeLabel = { '1': '24h', '7': '7d', '30': '30d', '90': '90d' }[timeframe];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      <Sidebar />

      <main className="lg:ml-60 pt-16 pb-20 lg:pb-6 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto py-8">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors mb-6"
          >
            ← Back
          </button>

          {/* Coin Header */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={coin?.image?.large} alt={coin?.name} className="w-16 h-16 rounded-full" />
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-white font-black text-2xl">{coin?.name}</h1>
                    <span className="text-gray-500 text-sm bg-white/5 px-2 py-1 rounded-lg">{coin?.symbol?.toUpperCase()}</span>
                    <span className="text-gray-600 text-xs bg-white/5 px-2 py-1 rounded-lg">#{coin?.market_cap_rank}</span>
                  </div>
                  <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-lg border ${signal.bg} ${signal.border}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${signal.dot}`} />
                    <span className={`text-xs font-semibold ${signal.color}`}>{signal.label}</span>
                    <span className="text-gray-500 text-xs">— {signal.explanation}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-2">
                <p className="text-white font-black text-3xl">${price?.toLocaleString()}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-sm font-bold px-2 py-1 rounded-lg ${priceChange24h > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {priceChange24h > 0 ? '+' : ''}{priceChange24h?.toFixed(2)}% (24h)
                  </span>
                  <span className={`text-sm font-bold px-2 py-1 rounded-lg ${priceChange7d > 0 ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {priceChange7d > 0 ? '+' : ''}{priceChange7d?.toFixed(2)}% (7d)
                  </span>
                </div>
                <button
                  onClick={handleWatchlist}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isWatchlisted(coinId)
                      ? 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400'
                      : 'bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400'
                  }`}
                >
                  {isWatchlisted(coinId) ? '✕ Remove from Watchlist' : '+ Add to Watchlist'}
                </button>
              </div>
            </div>
          </div>

          {/* Chart Card */}
          <div className="bg-white/3 border border-white/8 rounded-2xl mb-6 overflow-hidden hover:border-white/15 transition-all">

            {/* Chart Top Bar */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <img src={coin?.image?.large} alt={coin?.name} className="w-8 h-8 rounded-full" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-black text-sm">{coin?.symbol?.toUpperCase()} / USD</p>
                    <span className="text-gray-600 text-xs bg-white/5 px-2 py-0.5 rounded-lg">{coin?.name}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs">Live</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">CoinGecko · USD</p>
                </div>
              </div>

              {/* Timeframe */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
                {[
                  { label: '24h', value: '1' },
                  { label: '7d', value: '7' },
                  { label: '30d', value: '30' },
                  { label: '90d', value: '90' },
                ].map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all font-semibold ${
                      timeframe === tf.value
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                        : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Hero */}
            {!chartLoading && (
              <div className="px-6 py-4 flex items-end gap-4 flex-wrap">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Last Price</p>
                  <p className="text-white font-black text-4xl tracking-tight">${price?.toLocaleString()}</p>
                </div>
                <div className="mb-1 flex items-center gap-2 flex-wrap">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${isPositive ? 'bg-green-400/10 border border-green-400/20' : 'bg-red-400/10 border border-red-400/20'}`}>
                    <span className={isPositive ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
                      {isPositive ? '▲' : '▼'}
                    </span>
                    <span className={`text-sm font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {changeAbs}%
                    </span>
                  </div>
                  {changeDollar && (
                    <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : '-'}${changeDollar.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                  )}
                  <span className="text-gray-600 text-xs">{timeframeLabel} change</span>
                </div>
              </div>
            )}

            {/* Chart — drag to scroll */}
            {chartLoading ? (
              <div className="h-64 mx-6 mb-4 bg-white/3 rounded-xl animate-pulse" />
            ) : (
              <>
                <div
                  ref={chartScrollRef}
                  className="overflow-x-auto cursor-grab active:cursor-grabbing select-none px-4"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div style={{ minWidth: '700px' }}>
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="coinGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.2} />
                            <stop offset="70%" stopColor={strokeColor} stopOpacity={0.03} />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: '#374151', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          interval="preserveStartEnd"
                        />
                        <YAxis
                          domain={['auto', 'auto']}
                          tick={{ fill: '#374151', fontSize: 10 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`}
                          width={55}
                          orientation="right"
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        {high && (
                          <ReferenceLine
                            y={high}
                            stroke="rgba(34,197,94,0.3)"
                            strokeDasharray="4 4"
                            label={{ value: 'H', fill: '#22c55e', fontSize: 10, position: 'insideTopRight' }}
                          />
                        )}
                        {low && (
                          <ReferenceLine
                            y={low}
                            stroke="rgba(248,113,113,0.3)"
                            strokeDasharray="4 4"
                            label={{ value: 'L', fill: '#f87171', fontSize: 10, position: 'insideBottomRight' }}
                          />
                        )}
                        {openPrice && (
                          <ReferenceLine y={openPrice} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                        )}
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke={strokeColor}
                          strokeWidth={2}
                          fill="url(#coinGradient)"
                          dot={false}
                          activeDot={{ r: 5, fill: strokeColor, stroke: '#0a0a0f', strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <p className="text-center text-gray-700 text-xs pb-2">← drag to scroll →</p>
              </>
            )}

            {/* Stats Bar */}
            {!chartLoading && (
              <div className="border-t border-white/5 px-6 py-4">
                <div className="overflow-x-auto">
                  <div className="flex items-center gap-6 min-w-max pb-1">
                    <StatBox label="Open" value={`$${openPrice?.toLocaleString()}`} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label={`${timeframeLabel} High`} value={`$${high?.toLocaleString()}`} colored isPositive={true} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label={`${timeframeLabel} Low`} value={`$${low?.toLocaleString()}`} colored isPositive={false} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label="Current" value={`$${price?.toLocaleString()}`} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label="Change" value={`${isPositive ? '+' : '-'}${changeAbs}%`} colored isPositive={isPositive} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label="Range" value={`$${((high - low) || 0).toLocaleString()}`} sub="High - Low" />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label="Market Cap" value={formatNumber(marketData?.market_cap?.usd)} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label="24h Volume" value={formatNumber(marketData?.total_volume?.usd)} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox label="ATH" value={`$${marketData?.ath?.usd?.toLocaleString()}`} />
                    <div className="w-px h-8 bg-white/5 flex-shrink-0" />
                    <StatBox
                      label="ATH Change"
                      value={`${marketData?.ath_change_percentage?.usd?.toFixed(2)}%`}
                      colored
                      isPositive={marketData?.ath_change_percentage?.usd > 0}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Market Cap', value: formatNumber(marketData?.market_cap?.usd) },
              { label: '24h Volume', value: formatNumber(marketData?.total_volume?.usd) },
              { label: 'Circulating Supply', value: `${marketData?.circulating_supply?.toLocaleString()} ${coin?.symbol?.toUpperCase()}` },
              { label: 'All Time High', value: `$${marketData?.ath?.usd?.toLocaleString()}` },
              { label: '24h High', value: `$${marketData?.high_24h?.usd?.toLocaleString()}` },
              { label: '24h Low', value: `$${marketData?.low_24h?.usd?.toLocaleString()}` },
              { label: 'Market Cap Rank', value: `#${coin?.market_cap_rank}` },
              { label: 'ATH Change', value: `${marketData?.ath_change_percentage?.usd?.toFixed(2)}%` },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/3 border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                <p className="text-gray-500 text-xs mb-2">{stat.label}</p>
                <p className="text-white font-bold text-sm">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {coin?.description?.en && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">About {coin?.name}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-4">
                {coin?.description?.en.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          )}

          {/* AI Analysis */}
          <div className="mb-6">
            <AIAnalysisCard coin={coin} />
          </div>

          {/* News */}
          <NewsCard currency={coin?.symbol} />

        </div>
      </main>
    </div>
  );
};

export default CoinDetail;