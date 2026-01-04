import React from 'react';
import { MdFileUpload } from 'react-icons/md';

const Proofs = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdFileUpload size={32} className="text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Payment Proofs</h1>
        </div>
        <p className="text-gray-600">Upload and manage payment proof submissions</p>
      </div>

      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📤</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Proofs Feature Coming Soon!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Upload payment proofs, track approval status, and view your submission history.
        </p>
        <div className="mt-6 inline-block px-6 py-2 bg-green-100 text-green-800 rounded-lg">
          Task 7: Proof Upload System
        </div>
      </div>
    </div>
  );
};

export default Proofs;
