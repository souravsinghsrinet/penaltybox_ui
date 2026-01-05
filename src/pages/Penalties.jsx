import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdGavel, MdAdd, MdSearch, MdWarning, MdFilterList, MdGroup } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import IssuePenaltyModal from '../components/IssuePenaltyModal';
import StatusChangeModal from '../components/StatusChangeModal';

const Penalties = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [allPenalties, setAllPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssuePenaltyModal, setShowIssuePenaltyModal] = useState(false);
  const [selectedGroupForPenalty, setSelectedGroupForPenalty] = useState(null);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [selectedPenaltyForStatusChange, setSelectedPenaltyForStatusChange] = useState(null);

  useEffect(() => {
    fetchGroupsAndPenalties();
  }, []);

  const fetchGroupsAndPenalties = async () => {
    try {
      setLoading(true);
      
      // Fetch all groups the user is part of
      const groupsResponse = await api.get('/groups');
      const userGroups = groupsResponse.data;
      setGroups(userGroups);

      // Fetch penalties for each group
      const penaltiesPromises = userGroups.map(group =>
        api.get(`/penalties?group_id=${group.id}`)
          .then(res => ({
            groupId: group.id,
            groupName: group.name,
            penalties: res.data
          }))
          .catch(err => {
            console.error(`Error fetching penalties for group ${group.id}:`, err);
            return { groupId: group.id, groupName: group.name, penalties: [] };
          })
      );

      const penaltiesData = await Promise.all(penaltiesPromises);
      
      // Flatten penalties with group info
      const allPenaltiesWithGroup = penaltiesData.flatMap(group =>
        group.penalties.map(penalty => ({
          ...penalty,
          groupName: group.groupName,
          groupId: group.groupId
        }))
      );

      setAllPenalties(allPenaltiesWithGroup);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load penalties');
    } finally {
      setLoading(false);
    }
  };

  const handleIssuePenalty = (group) => {
    setSelectedGroupForPenalty(group);
    setShowIssuePenaltyModal(true);
  };

  const handlePenaltyActionSuccess = () => {
    setShowIssuePenaltyModal(false);
    setSelectedGroupForPenalty(null);
    fetchGroupsAndPenalties(); // Refresh data
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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

  // Filter penalties
  const filteredPenalties = allPenalties.filter(penalty => {
    const matchesGroup = selectedGroup === 'all' || penalty.groupId === parseInt(selectedGroup);
    const matchesStatus = selectedStatus === 'all' || penalty.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      (penalty.note && penalty.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      penalty.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesGroup && matchesStatus && matchesSearch;
  });

  // Group penalties by group for display
  const groupedPenalties = filteredPenalties.reduce((acc, penalty) => {
    const existingGroup = acc.find(g => g.groupId === penalty.groupId);
    if (existingGroup) {
      existingGroup.penalties.push(penalty);
    } else {
      acc.push({
        groupId: penalty.groupId,
        groupName: penalty.groupName,
        penalties: [penalty]
      });
    }
    return acc;
  }, []);

  // Calculate stats
  const totalPenalties = allPenalties.length;
  const paidPenalties = allPenalties.filter(p => p.status === 'PAID').length;
  const unpaidPenalties = allPenalties.filter(p => p.status === 'UNPAID').length;
  const totalAmount = allPenalties.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = allPenalties.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const unpaidAmount = allPenalties.filter(p => p.status === 'UNPAID').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <MdGavel size={32} className="text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Penalties</h1>
          </div>
        </div>
        <p className="text-gray-600">Manage and track penalties across all groups</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Penalties</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPenalties}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(totalAmount)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MdGavel className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Unpaid Penalties</p>
                  <p className="text-2xl font-bold text-orange-600">{unpaidPenalties}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(unpaidAmount)}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MdWarning className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Paid Penalties</p>
                  <p className="text-2xl font-bold text-green-600">{paidPenalties}</p>
                  <p className="text-sm text-gray-500 mt-1">{formatCurrency(paidAmount)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <MdGavel className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Group Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MdFilterList className="inline mr-1" />
                  Filter by Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Groups</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MdFilterList className="inline mr-1" />
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="PAID">PAID</option>
                  <option value="UNPAID">UNPAID</option>
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MdSearch className="inline mr-1" />
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by note or group name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <MdSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Penalties List */}
          {filteredPenalties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <MdWarning className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {allPenalties.length === 0 ? 'No Penalties Yet' : 'No Penalties Found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {allPenalties.length === 0
                  ? 'No penalties have been issued in any of your groups.'
                  : 'Try adjusting your filters or search query.'}
              </p>
              {user?.is_admin && allPenalties.length === 0 && groups.length > 0 && (
                <button
                  onClick={() => {
                    if (groups.length === 1) {
                      handleIssuePenalty(groups[0]);
                    } else {
                      toast.error('Please select a group to issue penalty');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <MdAdd className="w-5 h-5" />
                  Issue First Penalty
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {groupedPenalties.map((group) => (
                <div key={group.groupId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  {/* Group Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MdGroup className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{group.groupName}</h3>
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                          {group.penalties.length} {group.penalties.length === 1 ? 'penalty' : 'penalties'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {user?.is_admin && (
                          <button
                            onClick={() => handleIssuePenalty(groups.find(g => g.id === group.groupId))}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                          >
                            <MdAdd className="w-4 h-4" />
                            Issue Penalty
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/groups/${group.groupId}`)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          View Group
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Penalties List */}
                  <div className="divide-y divide-gray-200">
                    {group.penalties.map((penalty) => (
                      <div key={penalty.id} className="p-4 hover:bg-gray-50 transition-colors">
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
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span><strong>User:</strong> {penalty.user_name || `ID: ${penalty.user_id}`}</span>
                              <span><strong>Rule:</strong> {penalty.rule_title || `ID: ${penalty.rule_id}`}</span>
                              <span>{formatDate(penalty.created_at)}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex flex-col items-end gap-2">
                            <span className={`text-xl font-bold ${
                              penalty.status === 'PAID' ? 'text-green-600' : 'text-orange-600'
                            }`}>
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
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Issue Penalty Modal */}
      {showIssuePenaltyModal && selectedGroupForPenalty && (
        <IssuePenaltyModal
          groupId={selectedGroupForPenalty.id}
          groupName={selectedGroupForPenalty.name}
          onClose={() => {
            setShowIssuePenaltyModal(false);
            setSelectedGroupForPenalty(null);
          }}
          onSuccess={handlePenaltyActionSuccess}
        />
      )}

      {/* Status Change Modal */}
      {showStatusChangeModal && selectedPenaltyForStatusChange && (
        <StatusChangeModal
          penalty={selectedPenaltyForStatusChange}
          onClose={() => {
            setShowStatusChangeModal(false);
            setSelectedPenaltyForStatusChange(null);
          }}
          onSuccess={() => {
            fetchGroupsAndPenalties();
          }}
        />
      )}
    </div>
  );
};

export default Penalties;
