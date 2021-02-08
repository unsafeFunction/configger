import axiosClient from 'utils/axiosClient';
import mockClient from 'utils/mockClient';

export const fetchSessions = async () => {
  const sessions = await axiosClient.get('/scans/sessions/ ');

  return sessions;
};
