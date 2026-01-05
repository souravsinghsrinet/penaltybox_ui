import { useState } from 'react';
import { MdClose, MdDelete, MdWarning } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function DeleteRuleModal({ groupId, groupName, rule, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/groups/${groupId}/rules/${rule.id}`);
      
      toast.success(`Rule "${rule.title}" deleted successfully!`);
      onSuccess();
    } catch (error) {
      console.error('Error deleting rule:', error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete rules');
      } else if (error.response?.status === 404) {
        toast.error('Rule not found');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to delete rule');
      }
    } finally {
      setLoading(false);
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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <MdDelete className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Delete Rule</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <MdWarning className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Are you sure?</h3>
                <p className="text-sm text-red-700">
                  This action cannot be undone. Deleting this rule will permanently remove it from the group.
                </p>
              </div>
            </div>
          </div>

          {/* Rule Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">You are about to delete:</p>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{rule.title}</p>
                  <p className="text-sm text-gray-500 mt-1">Group: {groupName}</p>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(rule.amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Existing penalties that reference this rule will not be affected.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Rule'}
          </button>
        </div>
      </div>
    </div>
  );
}
