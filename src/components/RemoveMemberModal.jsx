import { useState } from 'react';
import { MdClose, MdPersonRemove, MdWarning } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function RemoveMemberModal({ groupId, groupName, member, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    try {
      setLoading(true);
      await api.delete(`/groups/${groupId}/members`, {
        data: { user_id: member.id }
      });
      
      toast.success(`${member.name} removed from ${groupName}`);
      onSuccess();
    } catch (error) {
      console.error('Error removing member:', error);
      if (error.response?.data?.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error('Failed to remove member');
      }
    } finally {
      setLoading(false);
    }
  };

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
              <div className="p-2 bg-red-100 rounded-lg">
                <MdWarning className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Remove Member
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to remove <span className="font-semibold">{member.name}</span> from{' '}
                <span className="font-semibold">{groupName}</span>?
              </p>

              {/* Member Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    member.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Role: <span className="capitalize font-medium">{member.role}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <MdWarning className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  This action cannot be undone. The member will lose access to this group and all its data.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Removing...
                  </>
                ) : (
                  <>
                    <MdPersonRemove className="w-5 h-5" />
                    Remove Member
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
