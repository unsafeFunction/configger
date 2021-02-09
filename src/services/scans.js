import mockClient from 'utils/mockClient';
import axiosClient from 'utils/axiosClient';

export const fetchScanById = async ({ scanId, sortBy }) => {
  // const scan = await mockClient.get('/scans/byId');

  const scan = await axiosClient.get(`/scans/${scanId}/`, {
    // params: {
    //   sort_by: sortBy,
    // },
  });

  return scan;
};

export const updateTube = async ({ id, tube_id }) => {
  console.log('services update tube id/tube_id', id, tube_id);

  const tube = await axiosClient.patch(`/scans/tubes/${id}/`, {
    tube_id,
  });

  return tube;
};
