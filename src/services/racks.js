import axiosClient from 'utils/axiosClient';

export const fetchRackScans = async query => {
  try {
    const rackScans = await axiosClient.get('/scans/rack/', {
      params: {
        ...query,
      },
    });

    return rackScans;
  } catch (error) {
    throw new Error(error);
  }
};
