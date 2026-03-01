import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px]" />
      </div>

      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Signal<span className="text-cyan-400">Lens</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black tracking-tight mb-2">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign up free
            </Link>
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="daniel@example.com"
                required
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-gray-600 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Demo Credentials */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3">
              Test Credentials
            </p>
            <div className="flex flex-col gap-1">
              <p className="text-gray-400 text-sm">
                Email: <span className="text-cyan-400">daniel@test.com</span>
              </p>
              <p className="text-gray-400 text-sm">
                Password: <span className="text-cyan-400">123456</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-l border-white/5">
        {/* Top Badge */}
        <div className="flex justify-end">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Markets Live</span>
          </div>
        </div>

        {/* Center Content */}
        <div>
          <h2 className="text-5xl font-black tracking-tight leading-tight mb-6">
            The market
            <br />
            never sleeps.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Neither do we.
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Sign back in and pick up where you left off. Your watchlist, signals, and market data are waiting.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Signals Today', value: '247', change: '+12%' },
            { label: 'BTC Dominance', value: '52.4%', change: '+0.8%' },
            { label: 'Total Market Cap', value: '$2.1T', change: '-1.2%' },
            { label: 'Active Traders', value: '8,492', change: '+5%' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/3 border border-white/8 rounded-xl p-4"
            >
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;