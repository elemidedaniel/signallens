import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { getAlerts, deleteAlert, toggleAlert } from '../services/api';
import { getScreenerCoins } from '../services/coinGecko';

const Alerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAlerts();
    fetchCoins();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data } = await getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoins = async () => {
    try {
      const data = await getScreenerCoins(1, 20);
      setCoins(data);
    } catch (err) {
      console.error('Failed to fetch coins');
    }
  };

  const handleCreate = async () => {
    if (!selectedCoin || !targetPrice) {
      setError('Please select a coin and enter a target price');
      return;
    }
    try {
      setCreating(true);
      setError('');
      const { createAlert } = await import('../services/api');
      await createAlert({
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        coinSymbol: selectedCoin.symbol,
        targetPrice: parseFloat(targetPrice),
        condition,
      });
      setShowForm(false);
      setSelectedCoin(null);
      setTargetPrice('');
      setCondition('above');
      fetchAlerts();
    } catch (err) {
      setError('Failed to create alert');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteAlert(id);
      setAlerts(alerts.filter((a) => a._id !== id));
    } catch (err) {
      console.error('Failed to delete alert');
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleAlert(id);
      setAlerts(alerts.map((a) => (a._id === id ? data : a)));
    } catch (err) {
      console.error('Failed to toggle alert');
    }
  };

  const filteredCoins = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
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
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Price Alerts</h1>
              <p className="text-gray-500 text-sm mt-1">
                Get notified by email when a coin hits your target price
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
            >
              + New Alert
            </button>
          </div>

          {/* Create Alert Form */}
          {showForm && (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 mb-6">
              <h2 className="text-white font-bold text-lg mb-4">Create New Alert</h2>

              {error && (
                <p className="text-red-400 text-sm mb-4 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2">
                  {error}
                </p>
              )}

              {/* Coin Search */}
              <div className="mb-4">
                <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">
                  Select Coin
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search coins..."
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-all text-sm mb-2"
                />
                {search && (
                  <div className="bg-[#0f0f17] border border-white/10 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                    {filteredCoins.map((coin) => (
                      <button
                        key={coin.id}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setSearch(coin.name);
                          setTargetPrice(coin.current_price.toString());
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all text-left"
                      >
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                        <span className="text-white text-sm">{coin.name}</span>
                        <span className="text-gray-500 text-xs">{coin.symbol.toUpperCase()}</span>
                        <span className="text-gray-400 text-xs ml-auto">
                          ${coin.current_price.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Condition & Price */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none text-sm"
                  >
                    <option value="above">Price goes above</option>
                    <option value="below">Price goes below</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-500 text-xs uppercase tracking-wider mb-2 block">
                    Target Price (USD)
                  </label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/30 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              {/* Selected Coin Preview */}
              {selectedCoin && (
                <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-4 flex items-center gap-3">
                  <img src={selectedCoin.image} alt={selectedCoin.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="text-white text-sm font-semibold">{selectedCoin.name}</p>
                    <p className="text-gray-500 text-xs">
                      Current: ${selectedCoin.current_price.toLocaleString()} → Alert: {condition}{' '}
                      ${parseFloat(targetPrice || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Alert'}
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

          {/* Alerts List */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-6 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="bg-white/3 border border-white/8 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🔔</p>
              <p className="text-white font-semibold mb-2">No alerts yet</p>
              <p className="text-gray-500 text-sm">
                Create your first price alert to get notified by email
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`bg-white/3 border rounded-2xl p-6 transition-all ${
                    alert.triggered
                      ? 'border-green-500/20'
                      : alert.active
                      ? 'border-white/8 hover:border-white/15'
                      : 'border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold">
                            {alert.coinName}
                          </p>
                          <span className="text-gray-500 text-xs bg-white/5 px-2 py-0.5 rounded-lg">
                            {alert.coinSymbol.toUpperCase()}
                          </span>
                          {alert.triggered && (
                            <span className="text-green-400 text-xs bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-lg">
                              ✅ Triggered
                            </span>
                          )}
                          {!alert.triggered && !alert.active && (
                            <span className="text-gray-500 text-xs bg-white/5 px-2 py-0.5 rounded-lg">
                              Paused
                            </span>
                          )}
                          {!alert.triggered && alert.active && (
                            <span className="text-cyan-400 text-xs bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-lg">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                          Alert when price goes{' '}
                          <span className={alert.condition === 'above' ? 'text-green-400' : 'text-red-400'}>
                            {alert.condition}
                          </span>{' '}
                          <span className="text-white font-semibold">
                            ${alert.targetPrice.toLocaleString()}
                          </span>
                        </p>
                        {alert.triggeredAt && (
                          <p className="text-gray-600 text-xs mt-1">
                            Triggered at {new Date(alert.triggeredAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!alert.triggered && (
                        <button
                          onClick={() => handleToggle(alert._id)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            alert.active
                              ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                          }`}
                        >
                          {alert.active ? 'Pause' : 'Resume'}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(alert._id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Alerts;