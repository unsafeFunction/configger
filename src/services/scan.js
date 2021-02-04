import axiosClient from 'utils/axiosClient';
import mockClient from 'utils/mockClient';

export const fetchSamples = async () => {
  const samples = await mockClient.get('/scans/byId');

  return samples;
};

// export const fetchScanSessions = async () => {
//   const samples = await mockClient.get('/scans/byId');

//   return samples;
// };
