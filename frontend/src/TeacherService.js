import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const TeacherService = {
  getTeachers: async () => {
    try {
      const response = await axios.get(`${API_URL}/teachers`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching teachers:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch teachers');
    }
  },

  getTeacher: async (email) => {
    try {
      const response = await axios.get(`${API_URL}/teachers/${encodeURIComponent(email)}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher with email ${email}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch teacher');
    }
  },

  addTeacher: async (teacherData) => {
    try {
      const response = await axios.post(`${API_URL}/teachers`, teacherData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error adding teacher:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to add teacher');
    }
  },

  updateTeacher: async (id, teacherData) => {
    try {
      const response = await axios.put(`${API_URL}/teachers/${id}`, teacherData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating teacher with id ${id}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to update teacher');
    }
  },

  toggleAvailability: async (email) => {
    try {
      const teacher = await TeacherService.getTeacher(email);
      const updatedTeacher = await axios.put(
        `${API_URL}/teachers/${teacher._id}`,
        { ...teacher, available: !teacher.available },
        { withCredentials: true }
      );
      return updatedTeacher.data;
    } catch (error) {
      console.error(`Error toggling availability for teacher ${email}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to toggle availability');
    }
  },

  uploadTimetableImage: async (email, file) => {
    try {
      const formData = new FormData();
      formData.append('timetableImage', file);
      const response = await axios.put(
        `${API_URL}/teachers/${encodeURIComponent(email)}/timetable-image`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading timetable image for teacher ${email}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to upload timetable image');
    }
  },

  removeTimetableImage: async (email) => {
    try {
      const teacher = await TeacherService.getTeacher(email);
      const updatedTeacher = await axios.put(
        `${API_URL}/teachers/${teacher._id}`,
        { ...teacher, timetableImage: null },
        { withCredentials: true }
      );
      return updatedTeacher.data;
    } catch (error) {
      console.error(`Error removing timetable image for teacher ${email}:`, error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to remove timetable image');
    }
  }
};

export default TeacherService;
