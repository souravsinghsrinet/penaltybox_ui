import { useState } from 'react';
import { FaTimes, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';
import toast from 'react-hot-toast';

const StatusChangeModal = ({ penalty, onClose, onSuccess }) => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Determine the target status (opposite of current)
  const targetStatus = penalty.status === 'PAID' ? 'UNPAID' : 'PAID';
  const isMarkingAsPaid = targetStatus === 'PAID';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const params = { status: targetStatus };
      if (note && note.trim()) {
        params.admin_note = note.trim();
      }
      
      await api.put(`/penalties/${penalty.id}/status`, null, { params });

      toast.success(`Penalty marked as ${targetStatus.toLowerCase()}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating penalty status:', error);
      toast.error(
        error.response?.data?.detail || 'Failed to update penalty status'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isMarkingAsPaid ? 'Mark as Paid' : 'Mark as Unpaid'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Warning/Info Box */}
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                isMarkingAsPaid
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              {isMarkingAsPaid ? (
                <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
              ) : (
                <FaExclamationTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${isMarkingAsPaid ? 'text-green-800' : 'text-yellow-800'}`}>
                  {isMarkingAsPaid
                    ? 'Confirm Cash Payment Receipt'
                    : 'Revert to Unpaid Status'}
                </p>
                <p className={`text-xs mt-1 ${isMarkingAsPaid ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isMarkingAsPaid
                    ? 'Use this option when a user has paid the penalty amount in cash. The penalty will be marked as PAID without requiring proof upload.'
                    : 'This will mark the penalty as UNPAID again. The user will need to pay or upload proof.'}
                </p>
              </div>
            </div>

            {/* Penalty Details */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">User:</span>
                <span className="font-medium text-gray-900">
                  {penalty.user_name || `User #${penalty.user_id}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rule:</span>
                <span className="font-medium text-gray-900">
                  {penalty.rule_title || `Rule #${penalty.rule_id}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold text-gray-900">
                  ₹{penalty.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    penalty.status === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {penalty.status}
                </span>
              </div>
            </div>

            {/* Optional Note Field */}
            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Note (Optional)
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={
                  isMarkingAsPaid
                    ? 'e.g., Received cash payment on 5 Jan 2026'
                    : 'Reason for reverting to unpaid status...'
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                This note will be saved in the payment record for audit trail.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isMarkingAsPaid
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Updating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isMarkingAsPaid ? (
                    <>
                      <FaCheckCircle size={16} />
                      Mark as Paid
                    </>
                  ) : (
                    <>
                      <FaTimesCircle size={16} />
                      Mark as Unpaid
                    </>
                  )}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StatusChangeModal;
