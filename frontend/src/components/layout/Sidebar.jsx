import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: '⚡', label: 'Dashboard', path: '/dashboard' },
  { icon: '🎯', label: 'Watchlist', path: '/profile' },
  { icon: '👤', label: 'Profile', path: '/profile' },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-60 border-r border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl p-4 z-40">
        {/* User Card */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">
                  {user?.fullName?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-white text-sm font-semibold truncate">{user?.fullName}</p>
              <p className="text-cyan-400 text-xs">{user?.userId}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                pathname === item.path
                  ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom - Market Status */}
        <div className="mt-auto">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs uppercase tracking-wider">Market Status</p>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <p className="text-green-400 text-sm font-semibold">Open 24/7</p>
            <p className="text-gray-500 text-xs mt-1">Crypto never sleeps</p>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/5 px-6 py-3">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`flex flex-col items-center gap-1 text-xs transition-all ${
                pathname === item.path ? 'text-cyan-400' : 'text-gray-500'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;