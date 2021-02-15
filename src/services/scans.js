import axiosClient from 'utils/axiosClient';

export const fetchScanById = async ({ scanId }) => {
  const scan = await axiosClient.get(`/scans/${scanId}/`);

  return scan;
};

export const updateTube = async ({ record, tube_id }) => {
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

export const deleteScan = async data => {
  try {
    const { id } = data;

    const scan = await axiosClient.delete(`/scans/${id}/`);

    return scan;
  } catch (error) {
    throw Error(error);
  }
};

export const updateScan = async ({ data, id }) => {
  try {
    const scan = await axiosClient.patch(`/scans/${id}/`, {
      ...data,
    });

    return scan;
  } catch (error) {
    throw Error(error);
  }
};
