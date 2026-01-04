import React from 'react';
import { MdGavel } from 'react-icons/md';

const Penalties = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdGavel size={32} className="text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Penalties</h1>
        </div>
        <p className="text-gray-600">Track your penalties and payments</p>
      </div>

      <div className="card text-center py-12">
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Penalties Feature Coming Soon!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          View all your penalties, track payment status, and see your penalty history.
        </p>
        <div className="mt-6 inline-block px-6 py-2 bg-orange-100 text-orange-800 rounded-lg">
          Task 5: Penalties Tracking
        </div>
      </div>
    </div>
  );
};

export default Penalties;
