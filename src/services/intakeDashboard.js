/* eslint-disable import/prefer-default-export */
import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchIntakeCounts = async (query) => {
  try {
    return await axiosClient.get('/intake-logs/daily-intake-counts/', {
      params: { ...query },
    });
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
