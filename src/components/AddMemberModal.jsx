import { useState, useEffect } from 'react';
import { MdClose, MdPersonAdd, MdSearch } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AddMemberModal({ groupId, groupName, existingMembers, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('member');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // You'll need to create this endpoint in the backend to list all users
      const response = await api.get('/users');
      // Filter out users who are already members
      const existingMemberIds = existingMembers.map(m => m.id);
      const availableUsers = response.data.filter(u => !existingMemberIds.includes(u.id));
      setUsers(availableUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/groups/${groupId}/members`, {
        user_id: selectedUser.id,
        role: selectedRole
      });
      
      toast.success(`${selectedUser.name} added to ${groupName}`);
      onSuccess();
    } catch (error) {
      console.error('Error adding member:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to add member');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MdPersonAdd className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add Member
                </h2>
                <p className="text-sm text-gray-500">to {groupName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search User
              </label>
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by name or email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* User List */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User *
              </label>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No users found' : 'No available users to add'}
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        {selectedUser?.id === user.id && (
                          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Role Selection */}
            {selectedUser && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="member"
                      checked={selectedRole === 'member'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                      selectedRole === 'member'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <p className="font-medium">Member</p>
                      <p className="text-xs text-gray-500 mt-1">Can view group</p>
                    </div>
                  </label>
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={selectedRole === 'admin'}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 border-2 rounded-lg text-center transition-all ${
                      selectedRole === 'admin'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <p className="font-medium">Admin</p>
                      <p className="text-xs text-gray-500 mt-1">Can manage members</p>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={!selectedUser || submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <MdPersonAdd className="w-5 h-5" />
                    Add Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
