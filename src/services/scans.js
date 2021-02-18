import axiosClient from 'utils/axiosClient';

export const fetchScanById = async ({ scanId }) => {
  const scan = await axiosClient.get(`/scans/${scanId}/`);

  return scan;
};

export const updateTube = async ({ id, data }) => {
  const tube = await axiosClient.patch(`/scans/tubes/${id}/`, {
    ...data,
  });

  return tube;
};

export const deleteTube = async ({ record, scanId }) => {
  const tube = await axiosClient.delete(
    `/scans/tubes/${record.id}/?scan_id=${scanId}`,
  );

  return tube;
};

export const invalidateTube = async ({ id, data }) => {
  return await axiosClient.patch(`/scans/tubes/${id}/`, {
    ...data,
  });
};

export const fetchSessionId = async () => {
  try {
    return await axiosClient.get(`/scans/sessions/active/`);
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteScan = async data => {
  try {
    const { id } = data;

    return await axiosClient.delete(`/scans/${id}/`);
  } catch (error) {
    throw new Error(error);
  }
};

export const updateScan = async ({ data, id }) => {
  try {
    const scan = await axiosClient.patch(`/scans/${id}/`, {
      ...data,
    });

    return scan;
  } catch (error) {
    throw new Error(error);
  }
};
