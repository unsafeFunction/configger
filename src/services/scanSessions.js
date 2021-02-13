import axiosClient from 'utils/axiosClient';

export const fetchSessions = async query => {
  const sessions = await axiosClient.get('/scans/sessions/', {
    params: {
      ...query,
    },
  });

  return sessions;
};

export const fetchSessionById = async sessionId => {
  const session = await axiosClient.get(`/scans/sessions/${sessionId}/`);
  return session;
};

export const updateSession = async data => {
  const session = await axiosClient.patch(`/scans/sessions/${data.id}/`, {
    ...data,
  });

  return session;
};
