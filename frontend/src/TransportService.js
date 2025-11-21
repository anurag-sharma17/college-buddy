import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TransportService = {
  getRoutes: async () => {
    try {
      const response = await axios.get(`${API_URL}/routes`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch routes');
    }
  }
};

export default TransportService;
