import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchIntakeCounts = async (query) => {
  try {
    return await axiosClient.get('/intake-logs/dayly-intake-counts/', {
      params: { ...query },
    });
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
