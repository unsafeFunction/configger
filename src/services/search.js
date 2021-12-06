/* eslint-disable import/prefer-default-export */
import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchInfo = async ({ search }) => {
  try {
    const searchInfo = await axiosClient.get(`/pools/search/`, {
      params: {
        tube_id: search,
      },
    });
    return searchInfo;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
