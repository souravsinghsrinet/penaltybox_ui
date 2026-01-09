import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MdDashboard, MdGroup, MdGavel, MdFileUpload, MdPerson } from 'react-icons/md';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [penalties, setPenalties] = useState([]);
  const [groups, setGroups] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all dashboard data in parallel
      const [penaltiesRes, groupsRes, leaderboardRes] = await Promise.all([
        api.get(`/penalties/user/${user.id}`),
        api.get('/groups'),
        api.get('/groups/leaderboard/global', { params: { sort_by: 'total_amount' } })
      ]);
      
      setPenalties(penaltiesRes.data);
      setGroups(groupsRes.data);
      setLeaderboard(leaderboardRes.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalPenalties = penalties.length;
  const totalPaid = penalties
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingDues = penalties
    .filter(p => p.status === 'UNPAID')
    .reduce((sum, p) => sum + p.amount, 0);
  const groupsJoined = groups.length;
  
  // Find user's rank
  const userRank = leaderboard.findIndex(entry => entry.user_id === user?.id) + 1;
  
  // Get recent penalties (last 5)
  const recentPenalties = penalties
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <MdDashboard size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <p className="text-gray-600">
          Welcome back, <span className="font-semibold">{user?.name}</span>
          {user?.is_admin && <span className="ml-2 text-purple-600">👑</span>}!
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Penalties</p>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-300 rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{totalPenalties}</p>
              )}
            </div>
            <div className="text-4xl">�</div>
          </div>
        </div>

        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Paid</p>
              {loading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-300 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
              )}
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="card bg-orange-50 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Dues</p>
              {loading ? (
                <div className="animate-pulse h-8 w-24 bg-gray-300 rounded"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(pendingDues)}</p>
              )}
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>

        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Groups Joined</p>
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-300 rounded"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900">{groupsJoined}</p>
              )}
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>
      </div>

      {/* Rank and Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Rank Card */}
        <div className="card bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-900 mb-2 font-medium">Your Current Rank</p>
              {loading ? (
                <div className="animate-pulse h-12 w-24 bg-yellow-300 rounded"></div>
              ) : userRank > 0 ? (
                <div className="flex items-center space-x-3">
                  <p className="text-5xl font-bold text-yellow-900">#{userRank}</p>
                  {userRank === 1 && <span className="text-4xl">🥇</span>}
                  {userRank === 2 && <span className="text-4xl">🥈</span>}
                  {userRank === 3 && <span className="text-4xl">🥉</span>}
                </div>
              ) : (
                <p className="text-lg text-yellow-900">Not ranked yet</p>
              )}
            </div>
            <div className="text-6xl">🏆</div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/groups"
              className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <MdGroup className="text-blue-600" size={20} />
              <span className="text-sm font-medium text-blue-700">My Groups</span>
            </Link>
            <Link
              to="/my-penalties"
              className="flex items-center justify-center space-x-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200"
            >
              <MdGavel className="text-orange-600" size={20} />
              <span className="text-sm font-medium text-orange-700">My Penalties</span>
            </Link>
            <Link
              to="/proofs"
              className="flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
            >
              <MdFileUpload className="text-green-600" size={20} />
              <span className="text-sm font-medium text-green-700">My Proofs</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center justify-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <MdPerson className="text-purple-600" size={20} />
              <span className="text-sm font-medium text-purple-700">My Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center justify-between p-4 bg-gray-100 rounded">
                <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : recentPenalties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Penalties Yet!</h3>
            <p className="text-gray-600">You're doing great! Keep it up.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPenalties.map((penalty) => (
              <div
                key={penalty.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{penalty.status === 'PAID' ? '✅' : '⏳'}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {penalty.rule?.title || `Rule #${penalty.rule_id}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {penalty.note || 'No note provided'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(penalty.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(penalty.amount)}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    penalty.status === 'PAID' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {penalty.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        {recentPenalties.length > 0 && (
          <div className="mt-4 text-center">
            <Link
              to="/my-penalties"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View all penalties →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
