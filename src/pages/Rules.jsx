import React from 'react';
import { MdRule } from 'react-icons/md';

const Rules = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdRule size={32} className="text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Rules</h1>
        </div>
        <p className="text-gray-600">View group rules and penalty guidelines</p>
      </div>

      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📜</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Rules Feature Coming Soon!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Browse all group rules, penalties, and fine amounts set by administrators.
        </p>
        <div className="mt-6 inline-block px-6 py-2 bg-purple-100 text-purple-800 rounded-lg">
          Task 6: Rules Management
        </div>
      </div>
    </div>
  );
};

export default Rules;
