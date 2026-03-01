import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    nationality: '',
    phoneNumber: '',
    profilePhoto: '',
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
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[120px]" />
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 border-r border-white/5">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SL</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Signal<span className="text-cyan-400">Lens</span>
          </span>
        </Link>

        {/* Center Content */}
        <div>
          <h2 className="text-5xl font-black tracking-tight leading-tight mb-6">
            Start reading
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              the signals.
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-md">
            Join thousands of traders who use SignalLens to decode market movements and make smarter decisions.
          </p>

          {/* Feature List */}
          <div className="mt-10 flex flex-col gap-4">
            {[
              'Real-time crypto signal detection',
              'Personal watchlist with live data',
              'Unique SignalLens trader ID',
              'Professional bento dashboard',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-400 text-xs">✓</span>
                </div>
                <span className="text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <p className="text-gray-300 text-sm leading-relaxed italic">
            "SignalLens gave me an edge I didn't know I was missing. The signal detection is incredibly accurate."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
            <div>
              <p className="text-white text-sm font-semibold">Alex Chen</p>
              <p className="text-gray-500 text-xs">Crypto Trader, Singapore</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Signal<span className="text-cyan-400">Lens</span>
            </span>
          </Link>

          <h1 className="text-3xl font-black tracking-tight mb-2">Create your account</h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign in
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
            {/* Full Name */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Daniel Elemide"
                required
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
              />
            </div>

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
                placeholder="Min. 6 characters"
                required
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
              />
            </div>

            {/* Nationality & Phone - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  placeholder="Nigerian"
                  required
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+234800000000"
                  required
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
                />
              </div>
            </div>

            {/* Profile Photo URL */}
            <div>
              <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
                Profile Photo URL{' '}
                <span className="text-gray-600 normal-case">(optional)</span>
              </label>
              <input
                type="url"
                name="profilePhoto"
                value={formData.profilePhoto}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
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
                  Creating account...
                </span>
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          {/* Terms */}
          <p className="text-gray-600 text-xs text-center mt-6">
            By creating an account you agree to our{' '}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;