import { useState } from 'react';
import { X, CheckCircle, XCircle, ZoomIn, ZoomOut } from 'lucide-react';

const ProofReviewModal = ({ proof, onClose, onApprove, onDecline }) => {
  const [adminNote, setAdminNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(proof.id, adminNote);
    setLoading(false);
  };

  const handleDecline = async () => {
    if (!adminNote.trim()) {
      alert('Please provide a reason for declining this proof');
      return;
    }
    setLoading(true);
    await onDecline(proof.id, adminNote);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800">Review Payment Proof</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User & Penalty Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">User Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {proof.user.name}</p>
                <p><span className="font-medium">Email:</span> {proof.user.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">Penalty Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Group:</span> {proof.group.name}</p>
                <p><span className="font-medium">Rule:</span> {proof.rule.title}</p>
                <p><span className="font-medium">Amount:</span> ₹{proof.penalty.amount.toFixed(2)}</p>
                {proof.penalty.note && (
                  <p><span className="font-medium">Note:</span> {proof.penalty.note}</p>
                )}
                <p><span className="font-medium">Issued:</span> {new Date(proof.penalty.created_at).toLocaleString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>

          {/* Proof Upload Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Proof Uploaded</h3>
            <p className="text-sm text-blue-700">
              {new Date(proof.created_at).toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Image Preview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Payment Screenshot</h3>
              <button
                onClick={() => setZoomed(!zoomed)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                {zoomed ? (
                  <>
                    <ZoomOut size={16} />
                    <span>Zoom Out</span>
                  </>
                ) : (
                  <>
                    <ZoomIn size={16} />
                    <span>Zoom In</span>
                  </>
                )}
              </button>
            </div>
            <div className={`border rounded-lg overflow-hidden ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                 onClick={() => setZoomed(!zoomed)}>
              <img
                src={`${API_URL}/uploads/${proof.image_url}`}
                alt="Payment Proof"
                className={`w-full transition-all duration-300 ${
                  zoomed ? 'max-w-none' : 'max-w-md mx-auto'
                }`}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="18">Image Not Found</text></svg>';
                }}
              />
            </div>
          </div>

          {/* Admin Note */}
          <div className="mb-6">
            <label htmlFor="adminNote" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Note {adminNote.trim() && <span className="text-red-600">*Required for declining</span>}
            </label>
            <textarea
              id="adminNote"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Add a note about this review (optional for approval, required for decline)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <CheckCircle size={20} />
              {loading ? 'Processing...' : 'Approve & Mark as Paid'}
            </button>
            <button
              onClick={handleDecline}
              disabled={loading}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-semibold"
            >
              <XCircle size={20} />
              {loading ? 'Processing...' : 'Decline Proof'}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            This action cannot be undone. Please review carefully before approving or declining.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProofReviewModal;
