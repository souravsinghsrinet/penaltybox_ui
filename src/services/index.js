import api from './api';

// Authentication Services
export const authService = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Groups Services
export const groupsService = {
  // Get all groups
  getAll: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  // Get group by ID
  getById: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  // Create a new group
  create: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Update group
  update: async (id, groupData) => {
    const response = await api.put(`/groups/${id}`, groupData);
    return response.data;
  },

  // Delete group
  delete: async (id) => {
    const response = await api.delete(`/groups/${id}`);
    return response.data;
  },
};

// Penalties Services
export const penaltiesService = {
  // Get user penalties
  getUserPenalties: async (userId) => {
    const response = await api.get(`/users/${userId}/penalties`);
    return response.data;
  },

  // Issue a penalty
  issuePenalty: async (groupId, penaltyData) => {
    const response = await api.post(`/groups/${groupId}/penalties`, penaltyData);
    return response.data;
  },

  // Update penalty status
  updateStatus: async (penaltyId, status) => {
    const response = await api.patch(`/penalties/${penaltyId}`, { status });
    return response.data;
  },
};

// Proofs Services
export const proofsService = {
  // Get proofs for a penalty
  getByPenalty: async (penaltyId) => {
    const response = await api.get(`/proofs?penalty_id=${penaltyId}`);
    return response.data;
  },

  // Upload proof
  uploadProof: async (formData) => {
    const response = await api.post('/proofs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Review proof
  reviewProof: async (proofId, reviewData) => {
    const response = await api.post(`/proofs/${proofId}/review`, reviewData);
    return response.data;
  },
};

// Leaderboard Service
export const leaderboardService = {
  // Get leaderboard
  getLeaderboard: async () => {
    const response = await api.get('/leaderboard');
    return response.data;
  },
};

// Payments Service
export const paymentsService = {
  // Get user payments
  getUserPayments: async (userId) => {
    const response = await api.get(`/payments/${userId}`);
    return response.data;
  },

  // Create payment
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },
};
