import axiosClient from 'utils/axiosClient';

export const fetchSessions = async query => {
  const sessions = await axiosClient.get('/scans/sessions', {
    params: {
      ...query,
    },
  });

  return sessions;
};
