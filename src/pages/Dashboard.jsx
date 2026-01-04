import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MdDashboard } from 'react-icons/md';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdDashboard size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <p className="text-gray-600">
          Welcome back, <span className="font-semibold">{user?.name}</span>
          {user?.is_admin && <span className="ml-2 text-purple-600">👑</span>}!
        </p>
      </div>

      {/* Welcome Card */}
      <div className="card mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome to Your Dashboard! 🎉
            </h2>
            <p className="text-blue-100">
              You're successfully logged in and authenticated.
            </p>
          </div>
          <div className="text-6xl">👋</div>
        </div>
      </div>

      {/* User Info Card */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Profile Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-32">Name:</span>
            <span className="text-gray-900 flex items-center">
              {user?.name}
              {user?.is_admin && <span className="ml-2 text-purple-600 text-lg" title="Admin User">👑</span>}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 font-medium w-32">Email:</span>
            <span className="text-gray-900">{user?.email}</span>
          </div>
          {user?.group_id && (
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-32">Group ID:</span>
                <span className="text-gray-900">{user.group_id}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Penalties</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="card bg-green-50 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-gray-900">₹0</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="card bg-orange-50 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Dues</p>
                <p className="text-3xl font-bold text-gray-900">₹0</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Coming Soon
          </h3>
          <div className="space-y-2 text-gray-600">
            <p>✨ In the next tasks, we'll add:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Complete navigation with sidebar</li>
              <li>Groups management</li>
              <li>Penalties tracking</li>
              <li>Proof upload and management</li>
              <li>Leaderboard rankings</li>
              <li>Payment history</li>
            </ul>
          </div>
        </div>

        {/* Test Authentication Card */}
        <div className="card mt-8 bg-green-50">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Authentication Test Successful!
          </h3>
          <p className="text-green-700">
            This page is protected and only visible to authenticated users. 
            Try logging out and accessing this page directly - you'll be redirected to login!
          </p>
        </div>
    </div>
  );
};

export default Dashboard;
