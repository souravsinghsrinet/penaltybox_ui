import React from 'react';
import { MdLeaderboard } from 'react-icons/md';

const Leaderboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdLeaderboard size={32} className="text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600">See who's leading in penalties and payments</p>
      </div>

      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Leaderboard Feature Coming Soon!
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          View rankings, top penalty payers, and compete with your group members.
        </p>
        <div className="mt-6 inline-block px-6 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
          Task 8: Leaderboard
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
