import axiosClient from 'utils/axiosClient';
import mockClient from 'utils/mockClient';

export const fetchSessions = async () => {
  const sessions = await mockClient.get('/sessions');

  return sessions;
};
