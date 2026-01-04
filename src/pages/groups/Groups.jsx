import React from 'react';
import { MdGroup } from 'react-icons/md';

const Groups = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdGroup size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
        </div>
        <p className="text-gray-600">View and manage your penalty groups</p>
      </div>

      {/* Coming Soon Card */}
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Groups Feature Coming Soon!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          This section will display all your groups, members, and allow you to join or create new groups.
        </p>
        <div className="mt-6 inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-lg">
          Task 4: Groups Management
        </div>
      </div>
    </div>
  );
};

export default Groups;
