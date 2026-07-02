import api from './api';

/**
 * Get all public programs (available to all users).
 */
export const getPrograms = async (params = {}) => {
  return await api.get('/programs', { params });
};

/**
 * Get all programs for admin (requires admin role).
 */
export const getAllPrograms = async () => {
  return await api.get('/admin/programs');
};

/**
 * Create a new program (admin only).
 */
export const createProgram = async (data) => {
  return await api.post('/admin/programs', data);
};

/**
 * Update an existing program (admin only).
 */
export const updateProgram = async (id, data) => {
  return await api.put(`/admin/programs/${id}`, data);
};

/**
 * Delete a program (admin only).
 */
export const deleteProgram = async (id) => {
  return await api.delete(`/admin/programs/${id}`);
};

/**
 * Get current user's enrolled programs.
 * Backend route: GET /api/v1/programs/me
 */
export const getJoinedPrograms = async () => {
  return await api.get('/programs/me');
};

/**
 * Get program by ID.
 */
export const getJoinedProgramById = async (id) => {
  return await api.get(`/programs/${id}`);
};

/**
 * Volunteer hours placeholder (backend not implemented yet).
 */
export const getVolunteerHours = async () => {
  return {
    success: true,
    data: {
      lifetime: 0,
      monthly: 0,
      weekly: 0,
    },
  };
};

export default {
  getPrograms,
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  getJoinedPrograms,
  getJoinedProgramById,
  getVolunteerHours,
};