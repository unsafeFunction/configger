import axiosClient from 'utils/axiosClient';
import mockClient from 'utils/mockClient';

export const fetchPoolScanById = async ({ poolScanId, sortBy }) => {
  const scan = await mockClient.get('/scans/byId');

  // const scan = await axiosClient.get(`/scans/pool-scan/${poolScanId}/`, {
  //   params: {
  //     sort_by: sortBy,
  //   },
  // });

  return scan;
};

export const updateTube = async ({ id, tube_id }) => {
  console.log('services update tube id/tube_id', id, tube_id);

  // const tube = await axiosClient.patch(`/scans/pool-scan-tube/${id}/`, {
  //   tube_id,
  // });

  // return tube;
  return;
};

// export const fetchScanSessions = async () => {
//   const samples = await mockClient.get('/scans/byId');

//   return samples;
// };
