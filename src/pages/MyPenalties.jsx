import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdGavel, MdCheckCircle, MdCancel, MdFileUpload } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';
import UploadProofModal from '../components/UploadProofModal';

export default function MyPenalties() {
  const { user } = useAuth();
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PAID, UNPAID
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchMyPenalties();
    }
  }, [user]);

  const fetchMyPenalties = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/penalties/user/${user.id}`);
      setPenalties(response.data);
    } catch (error) {
      console.error('Error fetching penalties:', error);
      toast.error('Failed to load penalties');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadProof = (penalty) => {
    setSelectedPenalty(penalty);
    setShowUploadModal(true);
  };

  const handleUploadSuccess = () => {
    fetchMyPenalties(); // Reload penalties after successful upload
  };

  // Filter penalties based on status
  const filteredPenalties = penalties.filter(penalty => {
    if (filterStatus === 'ALL') return true;
    return penalty.status === filterStatus;
  });

  // Calculate statistics
  const totalPenalties = penalties.length;
  const paidPenalties = penalties.filter(p => p.status === 'PAID').length;
  const unpaidPenalties = penalties.filter(p => p.status === 'UNPAID').length;
  const totalAmount = penalties.reduce((sum, p) => sum + p.amount, 0);
  const paidAmount = penalties.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const dueAmount = penalties.filter(p => p.status === 'UNPAID').reduce((sum, p) => sum + p.amount, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdGavel size={32} className="text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Penalties</h1>
        </div>
        <p className="text-gray-600">View and manage your penalty records</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Penalties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Penalties</p>
              <p className="text-3xl font-bold text-gray-900">{totalPenalties}</p>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MdGavel className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Paid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">{paidPenalties}</p>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(paidAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MdCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Due */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Dues</p>
              <p className="text-3xl font-bold text-orange-600">{unpaidPenalties}</p>
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(dueAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <MdCancel className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              filterStatus === 'ALL'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            All Penalties ({totalPenalties})
          </button>
          <button
            onClick={() => setFilterStatus('UNPAID')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              filterStatus === 'UNPAID'
                ? 'text-orange-600 border-b-2 border-orange-600 bg-orange-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Unpaid ({unpaidPenalties})
          </button>
          <button
            onClick={() => setFilterStatus('PAID')}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              filterStatus === 'PAID'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Paid ({paidPenalties})
          </button>
        </div>
      </div>

      {/* Penalties List */}
      {filteredPenalties.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <MdGavel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterStatus === 'ALL' ? 'No Penalties Yet' : `No ${filterStatus.toLowerCase()} penalties`}
          </h3>
          <p className="text-gray-500">
            {filterStatus === 'ALL' 
              ? "You haven't received any penalties yet. Keep up the good work!"
              : `You have no ${filterStatus.toLowerCase()} penalties at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Note/Reason
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPenalties.map((penalty) => (
                  <tr key={penalty.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(penalty.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{penalty.rule_title || `Rule #${penalty.rule_id}`}</div>
                      {penalty.group_id && (
                        <div className="text-xs text-gray-500">Group ID: {penalty.group_id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {penalty.note || <span className="text-gray-400 italic">No note provided</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-gray-900">
                      {formatCurrency(penalty.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {penalty.status === 'PAID' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <MdCheckCircle className="w-4 h-4 mr-1" />
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <MdCancel className="w-4 h-4 mr-1" />
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      {penalty.status === 'UNPAID' && (
                        <button
                          onClick={() => handleUploadProof(penalty)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <MdFileUpload className="w-4 h-4 mr-1" />
                          Upload Proof
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Payment Options</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Cash Payment:</strong> Pay the admin directly. They will mark your penalty as PAID.</li>
                <li><strong>Online/UPI Payment:</strong> Upload payment proof using the "Upload Proof" button. An admin will review and approve.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Proof Modal */}
      {showUploadModal && selectedPenalty && (
        <UploadProofModal
          penalty={selectedPenalty}
          onClose={() => {
            setShowUploadModal(false);
            setSelectedPenalty(null);
          }}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
