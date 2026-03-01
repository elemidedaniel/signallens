import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { getBTCChart, getBTCChart24h } from '../../services/coinGecko';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f0f17] border border-cyan-500/20 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-cyan-400 font-black text-base">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-gray-500 text-xs mt-1">{payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
};

const MarketChartCard = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceChange, setPriceChange] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');

  const fetchChartData = async (tf) => {
    setLoading(true);
    setError('');
    try {
      const data = tf === '24h' ? await getBTCChart24h() : await getBTCChart();

      const formatted = data.prices.map(([timestamp, price]) => ({
        date:
          tf === '24h'
            ? new Date(timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : new Date(timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }),
        price: Math.round(price),
      }));

      setChartData(formatted);

      const first = formatted[0]?.price;
      const last = formatted[formatted.length - 1]?.price;
      const change = (((last - first) / first) * 100).toFixed(2);
      setPriceChange(change);
      setCurrentPrice(last);
    } catch (err) {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(timeframe);
  }, [timeframe]);

  const isPositive = parseFloat(priceChange) >= 0;
  const strokeColor = isPositive ? '#22d3ee' : '#f87171';
  const gradientColor = isPositive ? '#22d3ee' : '#f87171';

  if (loading) {
    return (
      <div className="md:col-span-2 xl:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
          <div className="h-8 bg-white/10 rounded w-24 animate-pulse" />
        </div>
        <div className="h-6 bg-white/10 rounded w-40 animate-pulse mb-6" />
        <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
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
    <div className="md:col-span-2 xl:col-span-3 bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {/* BTC Icon */}
          <div className="w-8 h-8 rounded-full bg-[#F7931A]/20 border border-[#F7931A]/30 flex items-center justify-center">
            <span className="text-[#F7931A] text-sm font-black">₿</span>
          </div>
          <div>
            <p className="text-white font-black text-sm">Bitcoin</p>
            <p className="text-gray-500 text-xs">BTC / USD</p>
          </div>
        </div>

        {/* Timeframe Toggle */}
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

      {/* Price Display */}
      <div className="flex items-end gap-3 mb-6">
        <p className="text-white font-black text-3xl">
          ${currentPrice?.toLocaleString()}
        </p>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg mb-1 ${
            isPositive ? 'bg-green-400/10' : 'bg-red-400/10'
          }`}
        >
          <span className={isPositive ? 'text-green-400' : 'text-red-400'}>
            {isPositive ? '▲' : '▼'}
          </span>
          <span
            className={`text-sm font-bold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {Math.abs(priceChange)}%
          </span>
        </div>
        <p className="text-gray-500 text-xs mb-1">
          {timeframe === '24h' ? 'Last 24 hours' : 'Last 7 days'}
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="btcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColor} stopOpacity={0.25} />
              <stop offset="60%" stopColor={gradientColor} stopOpacity={0.05} />
              <stop offset="100%" stopColor={gradientColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#4b5563', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={['auto', 'auto']}
            tick={{ fill: '#4b5563', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            width={45}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#btcGradient)"
            dot={false}
            activeDot={{ r: 4, fill: strokeColor, stroke: '#0a0a0f', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Bottom Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        {[
          { label: 'Open', value: `$${chartData[0]?.price?.toLocaleString()}` },
          { label: 'Current', value: `$${currentPrice?.toLocaleString()}` },
          {
            label: 'Change',
            value: `${isPositive ? '+' : ''}${priceChange}%`,
            colored: true,
          },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-gray-600 text-xs mb-1">{stat.label}</p>
            <p
              className={`text-sm font-bold ${
                stat.colored
                  ? isPositive
                    ? 'text-green-400'
                    : 'text-red-400'
                  : 'text-white'
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketChartCard;