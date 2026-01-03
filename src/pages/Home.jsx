import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          🎯 PenaltyBox
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto px-4">
          Keep track of penalties, manage groups, and stay accountable.
          A transparent way to manage penalties and payments within your teams.
        </p>
        
        <div className="space-x-4">
          <Link
            to="/login"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block bg-blue-800 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            Register
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-white font-semibold text-lg mb-2">Manage Groups</h3>
            <p className="text-white/80 text-sm">
              Create and manage groups with custom rules and members
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-white font-semibold text-lg mb-2">Track Penalties</h3>
            <p className="text-white/80 text-sm">
              Issue, track, and manage penalties with proof verification
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-white font-semibold text-lg mb-2">Leaderboard</h3>
            <p className="text-white/80 text-sm">
              View rankings based on total penalties paid
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
