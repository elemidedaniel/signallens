import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';

const EditProfileModal = ({ onClose }) => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    phoneNumber: user?.phoneNumber || '',
    profilePhoto: user?.profilePhoto || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await updateProfile(formData);
      updateUser(data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div className="w-full max-w-md bg-[#0f0f17] border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-black text-xl">Edit Profile</h2>
            <p className="text-gray-500 text-sm mt-1">Update your phone or photo</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Read-only Info */}
        <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">
            Account Info (Read Only)
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Full Name</span>
              <span className="text-white text-sm">{user?.fullName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Email</span>
              <span className="text-white text-sm">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Trader ID</span>
              <span className="text-cyan-400 text-sm font-bold">{user?.userId}</span>
            </div>
          </div>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Phone Number */}
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
              className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-all text-sm"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-2 block">
              Profile Photo URL
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

          {/* Preview Photo */}
          {formData.profilePhoto && (
            <div className="flex items-center gap-3 bg-white/3 border border-white/8 rounded-xl p-3">
              <img
                src={formData.profilePhoto}
                alt="Preview"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => (e.target.style.display = 'none')}
              />
              <p className="text-gray-400 text-xs">Photo preview</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-black font-bold py-3 rounded-xl transition-all text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;