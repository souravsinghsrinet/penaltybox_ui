import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, MdGroups, MdPeople, MdAdminPanelSettings, 
  MdPersonAdd, MdPersonRemove, MdStar, MdGavel, MdWarning,
  MdLeaderboard, MdAdd, MdEdit, MdDelete
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import AddMemberModal from '../../components/AddMemberModal';
import RemoveMemberModal from '../../components/RemoveMemberModal';
import CreateRuleModal from '../../components/CreateRuleModal';
import EditRuleModal from '../../components/EditRuleModal';
import DeleteRuleModal from '../../components/DeleteRuleModal';
import IssuePenaltyModal from '../../components/IssuePenaltyModal';
import StatusChangeModal from '../../components/StatusChangeModal';

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [rules, setRules] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingTab, setLoadingTab] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [showEditRuleModal, setShowEditRuleModal] = useState(false);
  const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showIssuePenaltyModal, setShowIssuePenaltyModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [selectedPenaltyForStatusChange, setSelectedPenaltyForStatusChange] = useState(null);

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  useEffect(() => {
    // Load data when tab changes
    if (activeTab === 'rules') {
      fetchRules();
    } else if (activeTab === 'penalties') {
      fetchPenalties();
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab, id]);

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

  const fetchRules = async () => {
    try {
      setLoadingTab(true);
      const response = await api.get(`/groups/${id}/rules`);
      setRules(response.data);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast.error('Failed to load rules');
    } finally {
      setLoadingTab(false);
    }
  };

  const fetchPenalties = async () => {
    try {
      setLoadingTab(true);
      const response = await api.get(`/penalties?group_id=${id}`);
      setPenalties(response.data);
    } catch (error) {
      console.error('Error fetching penalties:', error);
      toast.error('Failed to load penalties');
    } finally {
      setLoadingTab(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoadingTab(true);
      const response = await api.get(`/groups/${id}/leaderboard`, {
        params: { sort_by: 'total_amount' }
      });
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    } finally {
      setLoadingTab(false);
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

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowEditRuleModal(true);
  };

  const handleDeleteRule = (rule) => {
    setSelectedRule(rule);
    setShowDeleteRuleModal(true);
  };

  const handleRuleActionSuccess = () => {
    setShowCreateRuleModal(false);
    setShowEditRuleModal(false);
    setShowDeleteRuleModal(false);
    setSelectedRule(null);
    fetchRules(); // Refresh rules data
  };

  const handlePenaltyActionSuccess = () => {
    setShowIssuePenaltyModal(false);
    fetchPenalties(); // Refresh penalties data
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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

  // Tab configuration
  const tabs = [
    { id: 'members', label: 'Members', icon: MdPeople, count: group.members.length },
    { id: 'rules', label: 'Rules', icon: MdGavel, count: rules.length },
    { id: 'penalties', label: 'Penalties', icon: MdWarning, count: penalties.length },
    { id: 'leaderboard', label: 'Leaderboard', icon: MdLeaderboard }
  ];

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
          {isGroupAdmin && activeTab === 'members' && (
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

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
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
          </div>
        )}

        {/* Rules Tab */}
        {activeTab === 'rules' && (
          <div>
            {/* Header with Create Button */}
            {user?.is_admin && (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => setShowCreateRuleModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MdAdd className="w-5 h-5" />
                  Create Rule
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {loadingTab ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : rules.length === 0 ? (
                <div className="text-center py-12">
                  <MdGavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Rules Yet</h3>
                  <p className="text-gray-500 mb-4">This group doesn't have any rules defined.</p>
                  {user?.is_admin && (
                    <button
                      onClick={() => setShowCreateRuleModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <MdAdd className="w-5 h-5" />
                      Create First Rule
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{rule.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Penalty: {formatCurrency(rule.amount)}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created {formatDate(rule.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-orange-600">
                            {formatCurrency(rule.amount)}
                          </span>
                          {user?.is_admin && (
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => handleEditRule(rule)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit rule"
                              >
                                <MdEdit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteRule(rule)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete rule"
                              >
                                <MdDelete className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Penalties Tab */}
        {activeTab === 'penalties' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Issue Penalty Button - Admin Only */}
            {user?.is_admin && activeTab === 'penalties' && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={() => setShowIssuePenaltyModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <MdAdd className="w-5 h-5" />
                  Issue Penalty
                </button>
              </div>
            )}

            {loadingTab ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : penalties.length === 0 ? (
              <div className="text-center py-12">
                <MdWarning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Penalties Yet</h3>
                <p className="text-gray-500 mb-4">This group doesn't have any penalties recorded.</p>
                {user?.is_admin && (
                  <button
                    onClick={() => setShowIssuePenaltyModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <MdAdd className="w-5 h-5" />
                    Issue First Penalty
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {penalties.map((penalty) => (
                  <div key={penalty.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            penalty.status === 'PAID'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {penalty.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800 mb-1">
                          <strong>Note:</strong> {penalty.note || 'No note provided'}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          <span><strong>User:</strong> {penalty.user_name || `ID: ${penalty.user_id}`}</span>
                          <span><strong>Rule:</strong> {penalty.rule_title || `ID: ${penalty.rule_id}`}</span>
                          <span>{formatDate(penalty.created_at)}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className="text-lg font-bold text-orange-600">
                          {formatCurrency(penalty.amount)}
                        </span>
                        
                        {/* Admin: Change Status Button */}
                        {user?.is_admin && (
                          <button
                            onClick={() => {
                              setSelectedPenaltyForStatusChange(penalty);
                              setShowStatusChangeModal(true);
                            }}
                            className={`text-xs px-3 py-1 rounded border transition-colors ${
                              penalty.status === 'PAID'
                                ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
                                : 'border-green-300 text-green-700 hover:bg-green-50'
                            }`}
                            title={penalty.status === 'PAID' ? 'Mark as Unpaid' : 'Mark as Paid (Cash)'}
                          >
                            {penalty.status === 'PAID' ? 'Mark Unpaid' : 'Mark Paid'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {loadingTab ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <MdLeaderboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Yet</h3>
                <p className="text-gray-500">Leaderboard will appear once penalties are recorded.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Penalties
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unpaid
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.user_id} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                            {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                            {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                            <span className="font-medium text-gray-900">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3">
                              {entry.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                              <div className="text-xs text-gray-500">{entry.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {entry.total_penalties}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                          {formatCurrency(entry.total_amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-orange-600">
                          {formatCurrency(entry.unpaid_amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
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

      {showCreateRuleModal && (
        <CreateRuleModal
          groupId={group.id}
          groupName={group.name}
          onClose={() => setShowCreateRuleModal(false)}
          onSuccess={handleRuleActionSuccess}
        />
      )}

      {showEditRuleModal && selectedRule && (
        <EditRuleModal
          groupId={group.id}
          groupName={group.name}
          rule={selectedRule}
          onClose={() => {
            setShowEditRuleModal(false);
            setSelectedRule(null);
          }}
          onSuccess={handleRuleActionSuccess}
        />
      )}

      {showDeleteRuleModal && selectedRule && (
        <DeleteRuleModal
          groupId={group.id}
          groupName={group.name}
          rule={selectedRule}
          onClose={() => {
            setShowDeleteRuleModal(false);
            setSelectedRule(null);
          }}
          onSuccess={handleRuleActionSuccess}
        />
      )}

      {showIssuePenaltyModal && (
        <IssuePenaltyModal
          groupId={group.id}
          groupName={group.name}
          onClose={() => setShowIssuePenaltyModal(false)}
          onSuccess={handlePenaltyActionSuccess}
        />
      )}

      {showStatusChangeModal && selectedPenaltyForStatusChange && (
        <StatusChangeModal
          penalty={selectedPenaltyForStatusChange}
          onClose={() => {
            setShowStatusChangeModal(false);
            setSelectedPenaltyForStatusChange(null);
          }}
          onSuccess={() => {
            fetchPenalties();
          }}
        />
      )}
    </div>
  );
}
