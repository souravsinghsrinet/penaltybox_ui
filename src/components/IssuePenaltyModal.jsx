import { useState, useEffect } from 'react';
import { MdClose, MdWarning } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function IssuePenaltyModal({ groupId, groupName, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    user_id: '',
    rule_id: '',
    amount: '',
    note: ''
  });
  const [members, setMembers] = useState([]);
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMembersAndRules();
  }, [groupId]);

  const fetchMembersAndRules = async () => {
    try {
      setLoadingData(true);
      
      // Fetch group members and rules in parallel
      const [membersResponse, rulesResponse] = await Promise.all([
        api.get(`/groups/${groupId}`),
        api.get(`/groups/${groupId}/rules`)
      ]);

      setMembers(membersResponse.data.members || []);
      setRules(rulesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load members and rules');
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_id) {
      newErrors.user_id = 'Please select a member';
    }

    if (!formData.rule_id) {
      newErrors.rule_id = 'Please select a rule';
    }

    if (!formData.amount) {
      newErrors.amount = 'Penalty amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await api.post(`/penalties?group_id=${groupId}`, {
        user_id: parseInt(formData.user_id),
        rule_id: parseInt(formData.rule_id),
        amount: parseFloat(formData.amount),
        note: formData.note.trim() || null
      });

      toast.success('Penalty issued successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error issuing penalty:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to issue penalties');
      } else if (error.response?.status === 404) {
        toast.error('Group, member, or rule not found');
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.detail || 'Invalid request');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to issue penalty');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle rule selection
    if (name === 'rule_id') {
      const rule = rules.find(r => r.id === parseInt(value));
      setSelectedRule(rule);
      
      // Auto-fill amount with rule's penalty amount
      if (rule) {
        setFormData(prev => ({
          ...prev,
          rule_id: value,
          amount: rule.amount.toString()
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          rule_id: value,
          amount: ''
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user makes a change
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MdWarning className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Issue Penalty</h2>
              <p className="text-sm text-gray-500">{groupName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {loadingData ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading members and rules...</p>
          </div>
        ) : (
          <>
            {/* Info Box */}
            <div className="m-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> You can override the rule's default penalty amount if needed (e.g., for legacy penalties).
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Member Selection */}
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Member <span className="text-red-500">*</span>
                </label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.user_id ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  disabled={loading || members.length === 0}
                >
                  <option value="">-- Select Member --</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.email})
                    </option>
                  ))}
                </select>
                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>
                )}
                {members.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">No members in this group</p>
                )}
              </div>

              {/* Rule Selection */}
              <div>
                <label htmlFor="rule_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Rule <span className="text-red-500">*</span>
                </label>
                <select
                  id="rule_id"
                  name="rule_id"
                  value={formData.rule_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border ${
                    errors.rule_id ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  disabled={loading || rules.length === 0}
                >
                  <option value="">-- Select Rule --</option>
                  {rules.map(rule => (
                    <option key={rule.id} value={rule.id}>
                      {rule.title} - {formatCurrency(rule.amount)}
                    </option>
                  ))}
                </select>
                {errors.rule_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.rule_id}</p>
                )}
                {rules.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">No rules in this group. Create a rule first.</p>
                )}
              </div>

              {/* Amount Field */}
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Penalty Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Enter custom amount or use rule default"
                  className={`w-full px-4 py-2 border ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                  disabled={loading}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
                {selectedRule && (
                  <p className="mt-1 text-sm text-gray-500">
                    Rule default: {formatCurrency(selectedRule.amount)} (You can override this)
                  </p>
                )}
              </div>

              {/* Note Field */}
              <div>
                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                  Note / Reason
                </label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add a note or reason for this penalty (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={loading || members.length === 0 || rules.length === 0}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Issuing...
                    </>
                  ) : (
                    'Issue Penalty'
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
