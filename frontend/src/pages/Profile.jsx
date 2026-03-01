import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import EditProfileModal from '../components/profile/EditProfileModal';

const Profile = () => {
  const { user } = useAuth();
  const { watchlist, removeCoin } = useWatchlist();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      <Sidebar />

      <main className="lg:ml-60 pt-16 pb-20 lg:pb-6 px-6 min-h-screen">
        <div className="max-w-5xl mx-auto py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight">Profile</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your account and watchlist.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              {/* Avatar & Name */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col items-center text-center">
                {/* Avatar */}
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt={user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-cyan-500/30 mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center mb-4">
                    <span className="text-white font-black text-3xl">
                      {user?.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <h2 className="text-white font-black text-xl">{user?.fullName}</h2>
                <p className="text-gray-500 text-sm mt-1">{user?.email}</p>

                {/* Trader ID Badge */}
                <div className="mt-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-2">
                  <p className="text-cyan-400 text-xs font-medium uppercase tracking-wider mb-1">
                    Trader ID
                  </p>
                  <p className="text-white font-black text-lg">{user?.userId}</p>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setShowEditModal(true)}
                  className="mt-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white text-sm font-semibold py-3 rounded-xl transition-all"
                >
                  ✏️ Edit Profile
                </button>
              </div>

              {/* Account Details */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">
                  Account Details
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Full Name', value: user?.fullName, icon: '👤' },
                    { label: 'Nationality', value: user?.nationality, icon: '🌍' },
                    { label: 'Phone', value: user?.phoneNumber, icon: '📱' },
                    {
                      label: 'Member Since',
                      value: user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'N/A',
                      icon: '📅',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <p className="text-gray-500 text-xs">{item.label}</p>
                        <p className="text-white text-sm font-semibold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Watchlist */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Watchlist */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">
                      My Watchlist
                    </p>
                    <p className="text-white font-black text-xl mt-1">
                      {watchlist.length} Coins
                    </p>
                  </div>
                  <span className="text-cyan-400 text-xs bg-cyan-400/10 border border-cyan-400/20 px-3 py-1.5 rounded-xl">
                    Synced to cloud ✓
                  </span>
                </div>

                {/* Empty State */}
                {watchlist.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 border border-dashed border-white/10 rounded-xl gap-3">
                    <span className="text-4xl">🎯</span>
                    <p className="text-white font-semibold">No coins yet</p>
                    <p className="text-gray-500 text-sm text-center max-w-xs">
                      Use the search bar in the navbar to find and add coins to your watchlist.
                    </p>
                  </div>
                )}

                {/* Watchlist Items */}
                {watchlist.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {watchlist.map((item, index) => (
                      <div
                        key={item.coinId}
                        className="flex items-center justify-between bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-4 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank */}
                          <span className="text-gray-600 text-xs w-5">{index + 1}</span>
                          {/* Image */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {item.symbol?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-white font-semibold text-sm">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {item.symbol?.toUpperCase()}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeCoin(item.coinId)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs px-3 py-1.5 rounded-lg transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Card */}
              <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">
                  Security
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <span className="text-green-400">🔒</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Password</p>
                      <p className="text-gray-500 text-xs">Last changed recently</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-xs bg-green-400/10 px-3 py-1.5 rounded-xl">
                    Secure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default Profile;