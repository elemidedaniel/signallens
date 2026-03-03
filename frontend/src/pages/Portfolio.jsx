import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { getPortfolio, addHolding, removeHolding } from '../services/api';
import { getScreenerCoins } from '../services/coinGecko';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22d3ee', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316', '#06b6d4'];

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [liveCoins, setLiveCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [{ data: portfolioData }, coinsData] = await Promise.all([
        getPortfolio(),
        getScreenerCoins(1, 20),
      ]);
      setPortfolio(portfolioData);
      setLiveCoins(coinsData);
    } catch (err) {
      console.error('Failed to fetch portfolio');
    } finally {
      setLoading(false);
    }
  };

  const getLivePrice = (coinId) => {
    const coin = liveCoins.find((c) => c.id === coinId);
    return coin?.current_price || 0;
  };

  const getLiveChange = (coinId) => {
    const coin = liveCoins.find((c) => c.id === coinId);
    return coin?.price_change_percentage_24h || 0;
  };

  const getTotalValue = () => {
    if (!portfolio?.holdings) return 0;
    return portfolio.holdings.reduce((sum, h) => sum + h.amount * getLivePrice(h.coinId), 0);
  };

  const getTotalCost = () => {
    if (!portfolio?.holdings) return 0;
    return portfolio.holdings.reduce((sum, h) => sum + h.amount * h.buyPrice, 0);
  };

  const getTotalPnL = () => getTotalValue() - getTotalCost();
  const getTotalPnLPercent = () => {
    const cost = getTotalCost();
    if (cost === 0) return 0;
    return ((getTotalValue() - cost) / cost) * 100;
  };

  const getPieData = () => {
    if (!portfolio?.holdings) return [];
    return portfolio.holdings.map((h) => ({
      name: h.coinSymbol.toUpperCase(),
      value: h.amount * getLivePrice(h.coinId),
    }));
  };

  const handleAdd = async () => {
    if (!selectedCoin || !amount || !buyPrice) {
      setError('Please fill all fields');
      return;
    }
    try {
      setAdding(true);
      setError('');
      await addHolding({
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol,
        coinImage: selectedCoin.image,
        amount: parseFloat(amount),
        buyPrice: parseFloat(buyPrice),
      });
      setShowForm(false);
      setSelectedCoin(null);
      setAmount('');
      setBuyPrice('');
      setSearch('');
      fetchData();
    } catch (err) {
      setError('Failed to add holding');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (coinId) => {
    try {
      await removeHolding(coinId);
      fetchData();
    } catch (err) {
      console.error('Failed to remove holding');
    }
  };

  const filteredCoins = liveCoins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = getTotalValue();
  const totalPnL = getTotalPnL();
  const totalPnLPercent = getTotalPnLPercent();
  const isProfit = totalPnL >= 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      <Sidebar />

      <main className="lg:ml-60 pt-16 pb-20 lg:pb-6 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Portfolio</h1>
              <p className="text-gray-500 text-sm mt-1">Track your crypto holdings and P&L</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              + Add Holding
            </button>
          </div>

          {/* Stats Cards */}
          {!loading && portfolio?.holdings?.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total Value</p>
                <p className="text-white text-2xl font-black">
                  ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className={`bg-white/3 border rounded-2xl p-5 ${isProfit ? 'border-green-500/20' : 'border-red-500/20'}`}>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Total P&L</p>
                <p className={`text-2xl font-black ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                  {isProfit ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-xs mt-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                  {isProfit ? '+' : ''}{totalPnLPercent.toFixed(2)}%
                </p>
              </div>
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Holdings</p>
                <p className="text-white text-2xl font-black">{portfolio.holdings.length}</p>
                <p className="text-gray-500 text-xs mt-1">Coins tracked</p>
              </div>
            </div>
          )}

          {/* Add Holding Form */}
          {showForm && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
              <h2 className="text-white font-bold text-lg mb-4">Add Holding</h2>
              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}
              <div className="mb-4">
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Select Coin</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search coins..."
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none text-sm mb-2"
                />
                {search && (
                  <div className="bg-[#0f0f17] border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {filteredCoins.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setSearch(coin.name);
                          setBuyPrice(coin.current_price.toString());
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
                      >
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-sm">{coin.name}</span>
                        <span className="text-gray-500 text-xs">{coin.symbol.toUpperCase()}</span>
                        <span className="text-gray-400 text-xs ml-auto">${coin.current_price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">Buy Price (USD)</label>
                  <input
                    type="number"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {adding ? 'Adding...' : 'Add Holding'}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 px-6 py-2.5 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : portfolio?.holdings?.length === 0 ? (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">📊</p>
              <p className="text-white font-semibold mb-2">No holdings yet</p>
              <p className="text-gray-500 text-sm">Add your first holding to start tracking your portfolio</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

              {/* Holdings Table */}
              <div className="xl:col-span-2 bg-white/3 border border-white/8 rounded-2xl">
                <div className="overflow-x-auto">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-2 px-6 py-3 border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider min-w-[520px]">
                    <div className="col-span-4">Coin</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-2 text-right">Value</div>
                    <div className="col-span-2 text-right">P&L</div>
                    <div className="col-span-2 text-right">24h</div>
                  </div>

                  {/* Rows */}
                  {portfolio.holdings.map((holding) => {
                    const livePrice = getLivePrice(holding.coinId);
                    const value = holding.amount * livePrice;
                    const cost = holding.amount * holding.buyPrice;
                    const pnl = value - cost;
                    const pnlPercent = cost > 0 ? ((value - cost) / cost) * 100 : 0;
                    const change24h = getLiveChange(holding.coinId);
                    const isPnlPositive = pnl >= 0;

                    return (
                      <div
                        key={holding.coinId}
                        onClick={() => navigate(`/coin/${holding.coinId}`)}
                        className="grid grid-cols-12 gap-2 px-6 py-4 border-b border-white/3 hover:bg-white/3 transition-all cursor-pointer group min-w-[520px]"
                      >
                        <div className="col-span-4 flex items-center gap-2">
                          {holding.coinImage && (
                            <img src={holding.coinImage} alt={holding.coinName} className="w-7 h-7 rounded-full flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-white text-sm font-semibold">{holding.coinSymbol.toUpperCase()}</p>
                            <p className="text-gray-600 text-xs">{holding.coinName}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <p className="text-gray-400 text-sm">{holding.amount}</p>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <p className="text-white text-sm font-semibold">
                            ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="col-span-2 flex items-center justify-end">
                          <div className="text-right">
                            <p className={`text-sm font-semibold ${isPnlPositive ? 'text-green-400' : 'text-red-400'}`}>
                              {isPnlPositive ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-xs ${isPnlPositive ? 'text-green-500' : 'text-red-500'}`}>
                              {isPnlPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-2">
                          <span className={`text-xs font-semibold ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRemove(holding.coinId); }}
                            className="text-gray-700 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Allocation</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={getPieData()}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {getPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']}
                      contentStyle={{ background: '#0f0f17', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 mt-4">
                  {getPieData().map((entry, index) => (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[index % COLORS.length] }} />
                        <span className="text-gray-400 text-xs">{entry.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {totalValue > 0 ? ((entry.value / totalValue) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Portfolio;