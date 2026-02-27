import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const authService = {
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, userData);
    return response.data;
  },

  validateToken: async (token) => {
    const response = await axios.get(`${API_URL}/api/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await axios.get(`${API_URL}/api/auth/profile/${userId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export default authService;
