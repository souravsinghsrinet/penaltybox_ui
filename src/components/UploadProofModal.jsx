import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function UploadProofModal({ penalty, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [reference, setReference] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG and PNG images are allowed');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      if (reference.trim()) {
        formData.append('reference', reference.trim());
      }

      await api.post(`/proofs/upload/${penalty.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Proof uploaded successfully! Processing...');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.response?.data?.detail || 'Failed to upload proof');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Upload Payment Proof</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Penalty Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Penalty</p>
            <p className="font-semibold text-gray-800">{penalty.rule_title}</p>
            <p className="text-lg font-bold text-orange-600 mt-1">₹{penalty.amount}</p>
          </div>

          {/* Reference/Note Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference/Note (Optional)
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., UPI Transaction ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={uploading}
            />
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Screenshot *
            </label>
            
            {!preview ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  <span className="text-orange-600 font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-gray-500">JPG or PNG (max 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            ) : (
              <div className="relative border-2 border-gray-200 rounded-lg p-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-contain rounded"
                />
                <button
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  <span className="truncate">{selectedFile?.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Your image will be automatically compressed to a thumbnail 
              to save storage space. An admin will review and approve your payment.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Proof
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
