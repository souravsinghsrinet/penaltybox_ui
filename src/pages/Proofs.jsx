import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { MdFileUpload, MdCheckCircle, MdCancel, MdPending, MdImage } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Proofs() {
  const { user } = useAuth();
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PENDING, APPROVED, DECLINED

  useEffect(() => {
    if (user?.id) {
      fetchUserProofs();
    }
  }, [user]);

  const fetchUserProofs = async () => {
    try {
      setLoading(true);
      // Get all penalties for the user
      const penaltiesResponse = await api.get(`/penalties/user/${user.id}`);
      const penalties = penaltiesResponse.data;

      // Fetch proofs for each penalty
      const proofsPromises = penalties.map(async (penalty) => {
        try {
          const proofsResponse = await api.get(`/proofs/penalty/${penalty.id}`);
          return proofsResponse.data.map(proof => ({
            ...proof,
            penalty_amount: penalty.amount,
            penalty_status: penalty.status,
            rule_title: penalty.rule_title,
            penalty_created_at: penalty.created_at
          }));
        } catch (error) {
          console.error(`Error fetching proofs for penalty ${penalty.id}:`, error);
          return [];
        }
      });

      const allProofs = await Promise.all(proofsPromises);
      const flattenedProofs = allProofs.flat();
      
      // Sort by created_at DESC (newest first)
      flattenedProofs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setProofs(flattenedProofs);
    } catch (error) {
      console.error('Error fetching proofs:', error);
      toast.error('Failed to load proofs');
    } finally {
      setLoading(false);
    }
  };

  // Filter proofs based on penalty status (since proofs don't have their own status yet)
  const filteredProofs = proofs.filter(proof => {
    if (filterStatus === 'ALL') return true;
    
    // Map penalty status to proof status
    if (filterStatus === 'APPROVED') {
      return proof.penalty_status === 'PAID';
    } else if (filterStatus === 'PENDING') {
      return proof.penalty_status === 'UNPAID';
    }
    
    return true;
  });

  // Statistics
  const totalProofs = proofs.length;
  const approvedProofs = proofs.filter(p => p.penalty_status === 'PAID').length;
  const pendingProofs = proofs.filter(p => p.penalty_status === 'UNPAID').length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (penaltyStatus) => {
    if (penaltyStatus === 'PAID') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <MdCheckCircle className="w-4 h-4 mr-1" />
          APPROVED
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <MdPending className="w-4 h-4 mr-1" />
          PENDING REVIEW
        </span>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdFileUpload size={32} className="text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Proofs</h1>
        </div>
        <p className="text-gray-600">View and track your uploaded payment proof submissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Proofs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalProofs}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdFileUpload className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{approvedProofs}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MdCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{pendingProofs}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <MdPending className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filterStatus === 'ALL'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Proofs ({totalProofs})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filterStatus === 'PENDING'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({pendingProofs})
            </button>
            <button
              onClick={() => setFilterStatus('APPROVED')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filterStatus === 'APPROVED'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Approved ({approvedProofs})
            </button>
          </nav>
        </div>
      </div>

      {/* Proofs List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading proofs...</p>
        </div>
      ) : filteredProofs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MdFileUpload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {filterStatus === 'ALL' ? 'No proofs uploaded yet' : `No ${filterStatus.toLowerCase()} proofs`}
          </h3>
          <p className="text-gray-600 mb-4">
            {filterStatus === 'ALL' 
              ? 'Upload payment proofs from the "My Penalties" page for online/UPI payments.'
              : `You don't have any ${filterStatus.toLowerCase()} proofs at the moment.`
            }
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rule/Penalty
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProofs.map((proof) => (
                  <tr key={proof.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {proof.image_url ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${proof.image_url}`}
                            alt="Payment proof"
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect fill="%23e5e7eb" width="48" height="48"/><text x="24" y="24" font-size="20" text-anchor="middle" dy=".3em">📷</text></svg>';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <MdImage className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{proof.rule_title || 'N/A'}</div>
                      <div className="text-sm text-gray-500">Penalty ID: #{proof.penalty_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(proof.penalty_amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(proof.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(proof.penalty_status)}
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
            <h3 className="text-sm font-medium text-blue-800">About Payment Proofs</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Upload payment proofs from the "My Penalties" page for online/UPI payments</li>
                <li>All uploaded images are automatically compressed to PNG thumbnails for optimal storage</li>
                <li>Admin will review your proof and approve/decline the payment</li>
                <li>Once approved, your penalty status will change to PAID automatically</li>
                <li>For cash payments, admin can directly mark penalties as PAID without requiring proof</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
