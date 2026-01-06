import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import api from '../services/api';
import ProofReviewModal from '../components/ProofReviewModal';
import { toast } from 'react-hot-toast';

const AdminProofReview = () => {
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING'); // PENDING, ALL, APPROVED, DECLINED
  const [selectedProof, setSelectedProof] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchProofs();
  }, [filter]);

  const fetchProofs = async () => {
    try {
      setLoading(true);
      const params = filter === 'ALL' ? {} : { status_filter: filter };
      const response = await api.get('/proofs', { params });
      setProofs(response.data);
    } catch (error) {
      console.error('Error fetching proofs:', error);
      toast.error('Failed to load proofs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (proofId, adminNote) => {
    try {
      await api.post(`/proofs/${proofId}/approve`, { admin_note: adminNote || null });
      toast.success('Proof approved and penalty marked as PAID!');
      setSelectedProof(null);
      fetchProofs();
    } catch (error) {
      console.error('Error approving proof:', error);
      toast.error(error.response?.data?.detail || 'Failed to approve proof');
    }
  };

  const handleDecline = async (proofId, adminNote) => {
    try {
      await api.post(`/proofs/${proofId}/decline`, { admin_note: adminNote });
      toast.success('Proof declined');
      setSelectedProof(null);
      fetchProofs();
    } catch (error) {
      console.error('Error declining proof:', error);
      toast.error(error.response?.data?.detail || 'Failed to decline proof');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
            <CheckCircle size={12} />
            Approved
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            <XCircle size={12} />
            Declined
          </span>
        );
      default:
        return null;
    }
  };

  const filteredProofs = proofs;
  const pendingCount = proofs.filter(p => p.status === 'PENDING').length;
  const approvedCount = proofs.filter(p => p.status === 'APPROVED').length;
  const declinedCount = proofs.filter(p => p.status === 'DECLINED').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Proof Review</h1>
        <p className="text-gray-600">Review and approve/decline payment proofs submitted by users</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proofs</p>
              <p className="text-2xl font-bold text-gray-800">{proofs.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Eye className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Declined</p>
              <p className="text-2xl font-bold text-red-600">{declinedCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setFilter('PENDING')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              filter === 'PENDING'
                ? 'text-yellow-600 border-b-2 border-yellow-600 bg-yellow-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('APPROVED')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              filter === 'APPROVED'
                ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setFilter('DECLINED')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              filter === 'DECLINED'
                ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            Declined ({declinedCount})
          </button>
          <button
            onClick={() => setFilter('ALL')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              filter === 'ALL'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            All ({proofs.length})
          </button>
        </div>
      </div>

      {/* Proofs List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading proofs...</p>
        </div>
      ) : filteredProofs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Eye size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'PENDING' && 'No Pending Proofs'}
            {filter === 'APPROVED' && 'No Approved Proofs'}
            {filter === 'DECLINED' && 'No Declined Proofs'}
            {filter === 'ALL' && 'No Proofs Found'}
          </h3>
          <p className="text-gray-500">
            {filter === 'PENDING' && 'All proofs have been reviewed'}
            {filter === 'APPROVED' && 'No proofs have been approved yet'}
            {filter === 'DECLINED' && 'No proofs have been declined yet'}
            {filter === 'ALL' && 'No payment proofs have been submitted yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Group & Rule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProofs.map((proof) => (
                <tr key={proof.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={`${API_URL}/uploads/${proof.image_url}`}
                      alt="Proof thumbnail"
                      className="h-16 w-16 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => setSelectedProof(proof)}
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="24">?</text></svg>';
                      }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{proof.user.name}</div>
                      <div className="text-sm text-gray-500">{proof.user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{proof.group.name}</div>
                      <div className="text-sm text-gray-500">{proof.rule.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">₹{proof.penalty.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(proof.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(proof.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(proof.status)}
                    {proof.reviewed_at && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(proof.reviewed_at).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedProof(proof)}
                      className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
                    >
                      <Eye size={16} />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {selectedProof && (
        <ProofReviewModal
          proof={selectedProof}
          onClose={() => setSelectedProof(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      )}
    </div>
  );
};

export default AdminProofReview;
