import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdGroups, MdAdd, MdPeople, MdAdminPanelSettings } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import CreateGroupModal from '../../components/CreateGroupModal';

export default function Groups() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchGroups(); // Refresh the list
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <MdGroups className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
            <p className="text-sm text-gray-500">
              {groups.length} {groups.length === 1 ? 'group' : 'groups'}
            </p>
          </div>
        </div>

        {/* Create Group Button - Only for Global Admins */}
        {user?.is_admin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdAdd className="w-5 h-5" />
            Create Group
          </button>
        )}
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <div className="text-center py-12">
          <MdGroups className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Groups Yet</h3>
          <p className="text-gray-500 mb-4">
            {user?.is_admin
              ? "Create your first group to get started"
              : "You haven't been added to any groups yet"}
          </p>
          {user?.is_admin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdAdd className="w-5 h-5" />
              Create Group
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => handleGroupClick(group.id)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              {/* Group Icon & Name */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <MdGroups className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {group.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              {group.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {group.description}
                </p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <MdPeople className="w-4 h-4" />
                  <span className="text-sm">
                    {group.member_count} {group.member_count === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-purple-600">
                  <MdAdminPanelSettings className="w-4 h-4" />
                  <span className="text-sm">
                    {group.admin_count} {group.admin_count === 1 ? 'admin' : 'admins'}
                  </span>
                </div>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                Created {formatDate(group.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
