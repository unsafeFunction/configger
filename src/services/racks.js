import axiosClient from 'utils/axiosClient';

export const fetchRackScans = async (query) => {
  try {
    const rackScans = await axiosClient.get('/scans/rack/', {
      params: { ...query },
    });

    return rackScans;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchRackScan = async (id) => {
  try {
    const rackScan = await axiosClient.get(`/scans/rack/${id}`);

    return rackScan;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateRackScan = async ({
  id,
  orientation_sign_off,
  rack_name,
}) => {
  try {
    const rackScan = await axiosClient.patch(`/scans/rack/${id}/`, {
      orientation_sign_off,
      rack_name,
    });

    return rackScan;
  } catch (error) {
    throw new Error(error?.response?.data.non_field_errors);
  }
};
