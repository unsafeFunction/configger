/* eslint-disable import/prefer-default-export */
import data from 'pages/ReflexList/data';
import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchReflexList = async (query) => {
  try {
    return data;
    // TODO: update API endpoint
    return await axiosClient.get('/reflex-list/', {
      params: {
        ...query,
      },
    });
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
