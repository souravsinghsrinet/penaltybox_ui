import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, MdGroups, MdPeople, MdAdminPanelSettings, 
  MdPersonAdd, MdPersonRemove, MdStar 
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AddMemberModal from '../../components/AddMemberModal';
import RemoveMemberModal from '../../components/RemoveMemberModal';

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/groups/${id}`);
      setGroup(response.data);
    } catch (error) {
      console.error('Error fetching group details:', error);
      if (error.response?.status === 403) {
        toast.error('You are not a member of this group');
        navigate('/groups');
      } else if (error.response?.status === 404) {
        toast.error('Group not found');
        navigate('/groups');
      } else {
        toast.error('Failed to load group details');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if current user is admin of this group
  const isGroupAdmin = group?.members?.find(
    m => m.id === user?.id && m.role === 'admin'
  );

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setShowRemoveMemberModal(true);
  };

  const handleMemberActionSuccess = () => {
    setShowAddMemberModal(false);
    setShowRemoveMemberModal(false);
    setSelectedMember(null);
    fetchGroupDetails(); // Refresh group data
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  // Separate admins and members
  const admins = group.members.filter(m => m.role === 'admin');
  const regularMembers = group.members.filter(m => m.role === 'member');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <MdArrowBack className="w-5 h-5" />
          Back to Groups
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdGroups className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              {group.description && (
                <p className="text-gray-600 mt-1">{group.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Created on {formatDate(group.created_at)}
              </p>
            </div>
          </div>

          {/* Add Member Button - Only for Group Admins */}
          {isGroupAdmin && (
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdPersonAdd className="w-5 h-5" />
              Add Member
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MdPeople className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{group.members.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MdAdminPanelSettings className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Group Admins</p>
              <p className="text-2xl font-bold text-gray-900">{admins.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Members</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {/* Admins Section */}
          {admins.length > 0 && (
            <div className="p-4 bg-purple-50">
              <div className="flex items-center gap-2 mb-3">
                <MdAdminPanelSettings className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-purple-900 uppercase">
                  Administrators ({admins.length})
                </h3>
              </div>
              <div className="space-y-2">
                {admins.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <MdStar className="w-4 h-4 text-yellow-500" title="Admin" />
                          {member.id === user?.id && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDate(member.joined_at)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button - Only for Group Admins, can't remove yourself if you're the last admin */}
                    {isGroupAdmin && member.id !== user?.id && (
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <MdPersonRemove className="w-5 h-5" />
                      </button>
                    )}
                    {isGroupAdmin && member.id === user?.id && admins.length === 1 && (
                      <span className="text-xs text-gray-400 italic">Last admin</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Members Section */}
          {regularMembers.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MdPeople className="w-5 h-5 text-gray-600" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase">
                  Members ({regularMembers.length})
                </h3>
              </div>
              <div className="space-y-2">
                {regularMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          {member.id === user?.id && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDate(member.joined_at)}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button - Only for Group Admins */}
                    {isGroupAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member)}
                        className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove member"
                      >
                        <MdPersonRemove className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddMemberModal && (
        <AddMemberModal
          groupId={group.id}
          groupName={group.name}
          existingMembers={group.members}
          onClose={() => setShowAddMemberModal(false)}
          onSuccess={handleMemberActionSuccess}
        />
      )}

      {showRemoveMemberModal && selectedMember && (
        <RemoveMemberModal
          groupId={group.id}
          groupName={group.name}
          member={selectedMember}
          onClose={() => {
            setShowRemoveMemberModal(false);
            setSelectedMember(null);
          }}
          onSuccess={handleMemberActionSuccess}
        />
      )}
    </div>
  );
}
