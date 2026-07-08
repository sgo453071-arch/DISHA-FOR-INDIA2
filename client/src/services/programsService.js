import api from './api';

const unwrap = (res) => {
  if (!res) return undefined;
  if (res.data && typeof res.data === 'object' && 'success' in res.data) {
    return res.data;
  }
  return res;
};

export const getPrograms = async (params = {}) => {
  const res = await api.get('/programs', { params });
  const payload = unwrap(res);
  return {
    programs: payload?.data?.programs || payload?.programs || [],
    pagination: payload?.data?.pagination || payload?.pagination || {},
    successMessage: payload?.message || 'Programs retrieved',
  };
};

export const getAllPrograms = async (params = {}) => {
  const res = await api.get('/programs', { params });
  const payload = unwrap(res);
  return {
    programs: payload?.data?.programs || payload?.programs || [],
    pagination: payload?.data?.pagination || payload?.pagination || {},
    successMessage: payload?.message || 'Programs retrieved',
  };
};

export const createProgram = async (data) => {
  const res = await api.post('/programs', data);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || payload?.program,
    successMessage: payload?.message || 'Program created',
  };
};

export const updateProgram = async (id, data) => {
  const res = await api.put(`/programs/${id}`, data);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || payload?.program,
    successMessage: payload?.message || 'Program updated',
  };
};

export const deleteProgram = async (id) => {
  const res = await api.delete(`/programs/${id}`);
  const payload = unwrap(res);
  return {
    successMessage: payload?.message || 'Program deleted',
  };
};

export const getJoinedPrograms = async () => {
  const res = await api.get('/programs/me');
  const payload = unwrap(res);
  return {
    programs: payload?.data?.programs || payload?.programs || [],
    pagination: payload?.data?.pagination || payload?.pagination || {},
    successMessage: payload?.message || 'Programs retrieved',
  };
};

export const getProgramById = async (id) => {
  const res = await api.get(`/programs/${id}`);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || payload?.program,
    successMessage: payload?.message || 'Program retrieved',
  };
};

export const getJoinedProgramById = async (id) => {
  const res = await api.get(`/programs/me/${id}`);
  const payload = unwrap(res);
  return {
    success: payload?.success ?? true,
    data: {
      program: payload?.data?.program || payload?.program || null,
    },
    successMessage: payload?.message || 'Program retrieved',
  };
};

export const getMyPrograms = async () => {
  const res = await api.get('/programs/me');
  const payload = unwrap(res);
  return {
    programs: payload?.data?.programs || payload?.programs || [],
    pagination: payload?.data?.pagination || payload?.pagination || {},
    successMessage: payload?.message || 'Programs retrieved',
  };
};

export const publishProgram = async (id) => {
  const res = await api.patch(`/programs/${id}/publish`);
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || payload?.program,
    successMessage: payload?.message || 'Program published',
  };
};

export const changeProgramStatus = async (id, status) => {
  const res = await api.patch(`/programs/${id}/status`, { status });
  const payload = unwrap(res);
  return {
    program: payload?.data?.program || payload?.program,
    successMessage: payload?.message || 'Program updated',
  };
};

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
  getProgramById,
  getMyPrograms,
  publishProgram,
  changeProgramStatus,
  getVolunteerHours,
};
