import axiosClient from 'utils/axiosClient';

export const fetchScanById = async ({ scanId }) => {
  const scan = await axiosClient.get(`/scans/pool/${scanId}/`);

  return scan;
};

export const updateTube = async ({ id, data }) => {
  try {
    const tube = await axiosClient.patch(`/scans/tubes/${id}/`, {
      ...data,
    });

    return tube;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};

export const deleteTube = async ({ tubeId, scanId }) => {
  try {
    const tube = await axiosClient.delete(
      `/scans/tubes/${tubeId}/from/${scanId}/`,
    );
    return tube;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
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

export const deleteScan = async (data) => {
  try {
    const { id } = data;

    return await axiosClient.delete(`/scans/pool/${id}/`);
  } catch (error) {
    throw new Error(error);
  }
};

export const cancelScan = async ({ data, id }) => {
  try {
    const scan = await axiosClient.put(`/scans/pool/${id}/`, {
      ...data,
    });

    return scan;
  } catch (error) {
    throw new Error(error?.response?.data.non_field_errors);
  }
};

export const updateScan = async ({ data, id }) => {
  try {
    const scan = await axiosClient.patch(`/scans/pool/${id}/`, {
      ...data,
    });

    return scan;
  } catch (error) {
    throw new Error(error?.response?.data.non_field_errors);
  }
};
