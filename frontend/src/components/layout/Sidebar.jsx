import { NavLink } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: '⬡', path: '/dashboard' },
  { label: 'Markets', icon: '◈', path: '/markets' },
  { label: 'Portfolio', icon: '◆', path: '/portfolio' },
  { label: 'Alerts', icon: '◉', path: '/alerts' },
  { label: 'Watchlist', icon: '◎', path: '/profile' },
];

const Sidebar = () => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-60 flex-col z-30">
        {/* Glass background */}
        <div className="absolute inset-0 bg-[#07070e]/90 backdrop-blur-xl border-r border-white/5" />
        
        {/* Glow effect */}
        <div className="absolute top-1/3 left-0 w-32 h-64 bg-cyan-500/5 blur-[60px] pointer-events-none" />

        <div className="relative flex flex-col h-full px-4 py-6">
          {/* Logo */}
          <div className="mb-8 px-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                <span className="text-black text-xs font-black">S</span>
              </div>
              <span className="text-white font-black text-lg tracking-tight">
                Signal<span className="text-cyan-400">Lens</span>
              </span>
            </div>
          </div>

          {/* Nav label */}
          {/* <p className="text-gray-600 text-xs uppercase tracking-[0.2em] px-2 mb-3">
            Navigation
          </p> */}

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active background */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent rounded-xl border border-cyan-500/10" />
                    )}

                    {/* Hover background */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/3 rounded-xl transition-all" />
                    )}

                    {/* Active left bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}

                    {/* Icon */}
                    <div className={`relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                        : 'bg-white/3 text-gray-600 group-hover:bg-white/5 group-hover:text-gray-400'
                    }`}>
                      <span className="text-base">{item.icon}</span>
                    </div>

                    {/* Label */}
                    <span className={`text-sm font-semibold tracking-wide transition-all ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                    }`}>
                      {item.label}
                    </span>

                    {/* Active dot */}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="mt-6 mb-4 border-t border-white/5" />

          {/* Market Status */}
          <div className="px-3 py-3 rounded-xl bg-white/3 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs uppercase tracking-wider">Market</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                <span className="text-green-400 text-xs font-semibold">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-green-400/10 flex items-center justify-center">
                <span className="text-green-400 text-xs">24</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold">Open 24/7</p>
                <p className="text-gray-600 text-xs">Crypto never sleeps</p>
              </div>
            </div>
          </div>

          {/* Bottom spacer */}
          <div className="mt-auto">
            <div className="px-3 py-2">
              <p className="text-gray-700 text-xs text-center">
                Powered by <span className="text-cyan-900">CoinGecko</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#07070e]/95 backdrop-blur-xl border-t border-white/5 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive ? 'text-cyan-400' : 'text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? 'bg-cyan-500/15' : ''
                  }`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <span className="text-xs font-semibold">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;