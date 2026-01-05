import { useState, useEffect } from 'react';
import { MdGavel, MdGroups, MdAdd, MdEdit, MdDelete, MdSearch } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import CreateRuleModal from '../components/CreateRuleModal';
import EditRuleModal from '../components/EditRuleModal';
import DeleteRuleModal from '../components/DeleteRuleModal';

const Rules = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [allRules, setAllRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateRuleModal, setShowCreateRuleModal] = useState(false);
  const [showEditRuleModal, setShowEditRuleModal] = useState(false);
  const [showDeleteRuleModal, setShowDeleteRuleModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedGroupForCreate, setSelectedGroupForCreate] = useState(null);

  useEffect(() => {
    fetchGroupsAndRules();
  }, []);

  const fetchGroupsAndRules = async () => {
    try {
      setLoading(true);
      
      // Fetch all groups the user is a member of
      const groupsResponse = await api.get('/groups');
      const userGroups = groupsResponse.data;
      setGroups(userGroups);

      // Fetch rules for each group
      const rulesPromises = userGroups.map(group => 
        api.get(`/groups/${group.id}/rules`)
          .then(response => ({
            groupId: group.id,
            groupName: group.name,
            rules: response.data
          }))
          .catch(error => {
            console.error(`Error fetching rules for group ${group.id}:`, error);
            return { groupId: group.id, groupName: group.name, rules: [] };
          })
      );

      const rulesData = await Promise.all(rulesPromises);
      
      // Flatten all rules with group info
      const flattenedRules = rulesData.flatMap(groupData => 
        groupData.rules.map(rule => ({
          ...rule,
          groupId: groupData.groupId,
          groupName: groupData.groupName
        }))
      );

      setAllRules(flattenedRules);
    } catch (error) {
      console.error('Error fetching groups and rules:', error);
      toast.error('Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRule = (rule) => {
    setSelectedRule(rule);
    setShowEditRuleModal(true);
  };

  const handleDeleteRule = (rule) => {
    setSelectedRule(rule);
    setShowDeleteRuleModal(true);
  };

  const handleCreateRule = (group) => {
    setSelectedGroupForCreate(group);
    setShowCreateRuleModal(true);
  };

  const handleRuleActionSuccess = () => {
    setShowCreateRuleModal(false);
    setShowEditRuleModal(false);
    setShowDeleteRuleModal(false);
    setSelectedRule(null);
    setSelectedGroupForCreate(null);
    fetchGroupsAndRules(); // Refresh all data
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
      day: 'numeric'
    });
  };

  // Filter rules based on selected group and search query
  const filteredRules = allRules.filter(rule => {
    const matchesGroup = selectedGroup === 'all' || rule.groupId === parseInt(selectedGroup);
    const matchesSearch = rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Group rules by group for display
  const rulesByGroup = filteredRules.reduce((acc, rule) => {
    if (!acc[rule.groupId]) {
      acc[rule.groupId] = {
        groupName: rule.groupName,
        rules: []
      };
    }
    acc[rule.groupId].rules.push(rule);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MdGavel className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rules</h1>
              <p className="text-gray-600">Manage penalty rules across all your groups</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{allRules.length}</div>
              <div className="text-xs text-gray-500">Total Rules</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold text-gray-900">{groups.length}</div>
              <div className="text-xs text-gray-500">Groups</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Group Filter */}
          <div className="flex-1">
            <label htmlFor="group-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Group
            </label>
            <select
              id="group-filter"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Rules
            </label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by rule title or group..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rules Display */}
      {filteredRules.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MdGavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedGroup !== 'all' ? 'No Rules Found' : 'No Rules Yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedGroup !== 'all' 
              ? 'Try adjusting your filters or search query'
              : 'Create your first rule to get started'
            }
          </p>
          {user?.is_admin && groups.length > 0 && !searchQuery && selectedGroup === 'all' && (
            <button
              onClick={() => handleCreateRule(groups[0])}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MdAdd className="w-5 h-5" />
              Create First Rule
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(rulesByGroup).map(([groupId, groupData]) => (
            <div key={groupId} className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Group Header */}
              <div className="border-b border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MdGroups className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{groupData.groupName}</h3>
                      <p className="text-sm text-gray-500">{groupData.rules.length} rule{groupData.rules.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.is_admin && (
                      <button
                        onClick={() => handleCreateRule({ id: parseInt(groupId), name: groupData.groupName })}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <MdAdd className="w-4 h-4" />
                        Add Rule
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/groups/${groupId}`)}
                      className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      View Group
                    </button>
                  </div>
                </div>
              </div>

              {/* Rules List */}
              <div className="divide-y divide-gray-200">
                {groupData.rules.map(rule => (
                  <div key={rule.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{rule.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Penalty: {formatCurrency(rule.amount)}</span>
                          <span>•</span>
                          <span>Created {formatDate(rule.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-orange-600">
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
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateRuleModal && selectedGroupForCreate && (
        <CreateRuleModal
          groupId={selectedGroupForCreate.id}
          groupName={selectedGroupForCreate.name}
          onClose={() => {
            setShowCreateRuleModal(false);
            setSelectedGroupForCreate(null);
          }}
          onSuccess={handleRuleActionSuccess}
        />
      )}

      {showEditRuleModal && selectedRule && (
        <EditRuleModal
          groupId={selectedRule.groupId}
          groupName={selectedRule.groupName}
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
          groupId={selectedRule.groupId}
          groupName={selectedRule.groupName}
          rule={selectedRule}
          onClose={() => {
            setShowDeleteRuleModal(false);
            setSelectedRule(null);
          }}
          onSuccess={handleRuleActionSuccess}
        />
      )}
    </div>
  );
};

export default Rules;
