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

export const updateTube = async ({ record, tube_id }) => {
  console.log('services update tube id/tube_id', record.id, tube_id);

  const tube = await axiosClient.patch(`/scans/tubes/${record.id}/`, {
    tube_id,
  });

  return tube;
};

export const deleteTube = async ({ record, scanId }) => {
  const tube = await axiosClient.delete(
    `/scans/tubes/${record.id}/?scan_id=${scanId}`,
  );

  return tube;
};

export const updateScan = async data => {
  try {
    const scan = await axiosClient.patch(`/scans/${data.id}/`, {
      ...data,
    });

    return scan;
  } catch (error) {
    throw new Error(error);
  }
};
