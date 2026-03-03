import { useState, useEffect, useRef } from 'react';
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
import { getBTCChart, getBTCChart24h } from '../../services/coinGecko';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const price = payload[0].value;
    const open = payload[0].payload.open;
    const change = open ? (((price - open) / open) * 100).toFixed(2) : null;
    const isUp = change >= 0;
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
  <div className="flex flex-col gap-0.5 min-w-[90px]">
    <p className="text-gray-600 text-xs uppercase tracking-wider">{label}</p>
    <p className={`text-sm font-bold ${colored ? (isPositive ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
      {value}
    </p>
    {sub && <p className="text-gray-600 text-xs">{sub}</p>}
  </div>
);

const MarketChartCard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceChange, setPriceChange] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);
  const [openPrice, setOpenPrice] = useState(null);
  const [volume, setVolume] = useState(null);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fetchChartData = async (tf) => {
    setLoading(true);
    setError('');
    try {
      const data = tf === '24h' ? await getBTCChart24h() : await getBTCChart();

      const formatted = data.prices.map(([timestamp, price], i) => ({
        date: tf === '24h'
          ? new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: Math.round(price),
        open: Math.round(data.prices[0][1]),
      }));

      setChartData(formatted);

      const prices = formatted.map((d) => d.price);
      const first = prices[0];
      const last = prices[prices.length - 1];
      const change = (((last - first) / first) * 100).toFixed(2);

      setPriceChange(change);
      setCurrentPrice(last);
      setHigh(Math.max(...prices));
      setLow(Math.min(...prices));
      setOpenPrice(first);

      if (data.total_volumes) {
        const totalVol = data.total_volumes.reduce((sum, [, v]) => sum + v, 0);
        setVolume(totalVol);
      }
    } catch (err) {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(timeframe);
  }, [timeframe]);

  // Drag to scroll
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX);
  };
  const handleMouseUp = () => setIsDragging(false);

  const isPositive = parseFloat(priceChange) >= 0;
  const strokeColor = isPositive ? '#22d3ee' : '#f87171';
  const changeAbs = Math.abs(priceChange);
  const changeDollar = openPrice && currentPrice ? Math.abs(currentPrice - openPrice) : null;

  if (loading) {
    return (
      <div className="md:col-span-2 xl:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/10 rounded w-32 mb-4" />
        <div className="h-8 bg-white/10 rounded w-48 mb-2" />
        <div className="h-56 bg-white/5 rounded-xl mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:col-span-2 xl:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="md:col-span-2 xl:col-span-3 bg-white/3 border border-white/8 rounded-2xl hover:border-white/15 transition-all overflow-hidden">

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#F7931A]/15 border border-[#F7931A]/30 flex items-center justify-center">
            <span className="text-[#F7931A] text-base font-black">₿</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-black text-sm">BTC / USD</p>
              <span className="text-gray-600 text-xs bg-white/5 px-2 py-0.5 rounded-lg">Bitcoin</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs">Live</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-0.5">Binance · CoinGecko</p>
          </div>
        </div>

        {/* Timeframe */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-xl p-1">
          {['24h', '7d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-xs px-3 py-1.5 rounded-lg transition-all font-semibold ${
                timeframe === tf
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Price Hero */}
      <div className="px-6 py-4 flex items-end gap-4 flex-wrap">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Last Price</p>
          <p className="text-white font-black text-4xl tracking-tight">
            ${currentPrice?.toLocaleString()}
          </p>
        </div>
        <div className="mb-1 flex items-center gap-2">
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
              {isPositive ? '+' : '-'}${changeDollar.toLocaleString()}
            </span>
          )}
          <span className="text-gray-600 text-xs">{timeframe === '24h' ? '24h change' : '7d change'}</span>
        </div>
      </div>

      {/* Chart — horizontal scroll */}
      <div
        ref={scrollRef}
        className="overflow-x-auto cursor-grab active:cursor-grabbing select-none px-4"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={{ minWidth: '700px' }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
                width={50}
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
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
                <ReferenceLine
                  y={openPrice}
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="4 4"
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                fill="url(#btcGradient)"
                dot={false}
                activeDot={{ r: 5, fill: strokeColor, stroke: '#0a0a0f', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scroll hint */}
      <p className="text-center text-gray-700 text-xs pb-1">← drag to scroll →</p>

      {/* Stats Bar — scrollable */}
      <div className="border-t border-white/5 px-6 py-4">
        <div
          ref={scrollRef}
          className="overflow-x-auto"
        >
          <div className="flex items-center gap-6 min-w-max pb-1">
            <StatBox
              label="Open"
              value={`$${openPrice?.toLocaleString()}`}
            />
            <div className="w-px h-8 bg-white/5 flex-shrink-0" />
            <StatBox
              label={`${timeframe} High`}
              value={`$${high?.toLocaleString()}`}
              colored
              isPositive={true}
            />
            <div className="w-px h-8 bg-white/5 flex-shrink-0" />
            <StatBox
              label={`${timeframe} Low`}
              value={`$${low?.toLocaleString()}`}
              colored
              isPositive={false}
            />
            <div className="w-px h-8 bg-white/5 flex-shrink-0" />
            <StatBox
              label="Current"
              value={`$${currentPrice?.toLocaleString()}`}
            />
            <div className="w-px h-8 bg-white/5 flex-shrink-0" />
            <StatBox
              label="Change"
              value={`${isPositive ? '+' : '-'}${changeAbs}%`}
              colored
              isPositive={isPositive}
            />
            <div className="w-px h-8 bg-white/5 flex-shrink-0" />
            <StatBox
              label="Range"
              value={`$${((high - low) || 0).toLocaleString()}`}
              sub="High - Low"
            />
            <div className="w-px h-8 bg-white/5 flex-shrink-0" />
            {volume && (
              <StatBox
                label="Volume"
                value={`$${(volume / 1e9).toFixed(2)}B`}
                sub={timeframe}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketChartCard;