import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#0a0a0f]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SL</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Signal<span className="text-cyan-400">Lens</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">How It Works</a>
            <a href="#stats" className="text-gray-400 hover:text-white text-sm transition-colors">Stats</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white text-sm transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-cyan-400 text-xs font-medium tracking-widest uppercase">
              Live Market Intelligence
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Decode the Market.
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Before It Moves.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            SignalLens transforms raw crypto data into actionable intelligence.
            Track signals, monitor movers, and stay ahead of the market — all in one dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              Start For Free →
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Sign In
            </Link>
          </div>

          {/* Hero Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-16 pt-16 border-t border-white/5">
            {[
              { value: '10,000+', label: 'Coins Tracked' },
              { value: '50K+', label: 'Signals Generated' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4">
              Why SignalLens
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Everything you need to
              <br />
              <span className="text-gray-500">trade smarter.</span>
            </h2>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Real-Time Signals',
                description:
                  'Our signal engine analyzes price action, volume spikes, and momentum to surface high-probability moves before they happen.',
                color: 'cyan',
              },
              {
                icon: '📊',
                title: 'Market Intelligence',
                description:
                  'Global market cap, BTC dominance, trending movers, and volume anomalies — all in a single bento dashboard.',
                color: 'purple',
              },
              {
                icon: '🎯',
                title: 'Smart Watchlist',
                description:
                  'Build your personal watchlist and track your favorite coins with live data, signals, and price alerts.',
                color: 'blue',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white/3 hover:bg-white/5 border border-white/8 hover:border-white/15 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/8 rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '$2.4B', label: 'Volume Tracked' },
                { value: '500+', label: 'Daily Signals' },
                { value: '150+', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4">
              Simple Process
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Up and running
              <br />
              <span className="text-gray-500">in 3 steps.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up in seconds. No credit card required. Get your unique SignalLens ID instantly.',
              },
              {
                step: '02',
                title: 'Build Your Watchlist',
                description: 'Search and add your favorite coins. SignalLens tracks them 24/7 and alerts you to key signals.',
              },
              {
                step: '03',
                title: 'Trade With Confidence',
                description: 'Use our signal engine to identify momentum, volatility, and volume spikes before the crowd.',
              },
            ].map((item, index) => (
              <div key={item.step} className="relative flex flex-col items-start">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-white/10 to-transparent" />
                )}
                <div className="text-6xl font-black text-white/5 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 border border-white/8 rounded-3xl p-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Ready to see the
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                signal?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join thousands of traders using SignalLens to stay ahead of the market every day.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold px-10 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-cyan-500/30 hover:-translate-y-0.5"
            >
              Get Started For Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SL</span>
            </div>
            <span className="text-white font-bold tracking-tight">
              Signal<span className="text-cyan-400">Lens</span>
            </span>
          </div>
          <p className="text-gray-600 text-sm">© 2024 SignalLens. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Terms</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;