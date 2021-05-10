import axiosClient from 'utils/axiosClient';

export const fetchScanById = async (scanId) => {
  try {
    const scan = await axiosClient.get(`/scans/pool/${scanId}/`);

    return scan;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchActiveScans = async () => {
  try {
    const scans = await axiosClient.get(`/active/refresh`);

    return scans;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTube = async ({ id, data }) => {
  try {
    const tube = await axiosClient.patch(`/scans/tubes/${id}/`, { ...data });

    return tube;
  } catch (error) {
    throw new Error(error.response.data.field_errors.tube_id);
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

export const deleteScan = async ({ id }) => {
  try {
    return await axiosClient.delete(`/scans/pool/${id}/`);
  } catch (error) {
    throw new Error(error);
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
