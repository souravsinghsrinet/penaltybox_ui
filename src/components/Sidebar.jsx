import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdGroup,
  MdGavel,
  MdRule,
  MdFileUpload,
  MdLeaderboard,
  MdAdd,
  MdAdminPanelSettings,
  MdClose,
} from 'react-icons/md';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  // Navigation items for all users
  const userNavItems = [
    { path: '/dashboard', icon: MdDashboard, label: 'Dashboard' },
    { path: '/groups', icon: MdGroup, label: 'Groups' },
    { path: '/penalties', icon: MdGavel, label: 'Penalties' },
    { path: '/rules', icon: MdRule, label: 'Rules' },
    { path: '/proofs', icon: MdFileUpload, label: 'Proofs' },
    { path: '/leaderboard', icon: MdLeaderboard, label: 'Leaderboard' },
  ];

  // Additional items for admin users
  const adminNavItems = [
    { path: '/admin/create-group', icon: MdAdd, label: 'Create Group' },
    { path: '/admin/manage', icon: MdAdminPanelSettings, label: 'Manage' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          w-64 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🎯</span>
            <div>
              <h1 className="text-xl font-bold text-gray-800">PenaltyBox</h1>
              <p className="text-xs text-gray-500">Track & Manage</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate flex items-center">
                {user?.name}
                {user?.is_admin && (
                  <span className="ml-1 text-purple-600" title="Admin">
                    👑
                  </span>
                )}
              </p>
              <p className="text-xs text-gray-600 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* User Navigation Items */}
          <div className="space-y-1">
            {userNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${
                      active
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Admin Navigation Items */}
          {user?.is_admin && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Admin Tools
              </p>
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        transition-all duration-200
                        ${
                          active
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'text-gray-700 hover:bg-purple-50'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2026 PenaltyBox</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
