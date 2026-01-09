import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdPerson, MdEdit, MdLock, MdSave } from 'react-icons/md';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Profile = () => {
  const { user, setUser } = useAuth();
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Handle profile edit
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileData({
      name: user?.name || '',
      email: user?.email || ''
    });
  };

  const handleProfileSave = async () => {
    if (!profileData.name || !profileData.email) {
      toast.error('Name and email are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditingProfile(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordData.new_password.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/${user.id}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to change password');
      }

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setIsChangingPassword(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdPerson size={32} className="text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            My Profile
          </h1>
        </div>
        <p className="text-gray-600">
          Manage your account information and settings
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
          {!isEditingProfile && (
            <button
              onClick={handleProfileEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdEdit size={18} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                onClick={handleProfileSave}
                disabled={profileLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                <MdSave size={18} />
                <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleProfileCancel}
                disabled={profileLoading}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium w-32">Name:</span>
              <span className="text-gray-900 flex items-center">
                {user.name}
                {user.is_admin && <span className="ml-2 text-purple-600 text-lg" title="Admin User">👑</span>}
              </span>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium w-32">Email:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600 font-medium w-32">Account Type:</span>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded ${
                user.is_admin 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {user.is_admin ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <MdLock size={18} />
              <span>Change Password</span>
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="input"
                placeholder="Enter your current password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="input"
                placeholder="Enter your new password (min. 6 characters)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirm_password}
                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                className="input"
                placeholder="Confirm your new password"
                required
              />
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button
                type="submit"
                disabled={passwordLoading}
                className="flex items-center space-x-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400"
              >
                <MdSave size={18} />
                <span>{passwordLoading ? 'Changing...' : 'Change Password'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
                  });
                }}
                disabled={passwordLoading}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              Keep your account secure by using a strong password. 
              We recommend changing your password periodically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
