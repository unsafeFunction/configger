import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchReflexList = async (query) => {
  try {
    return await axiosClient.get('/runs/results/rerun/', {
      params: {
        ...query,
      },
    });
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const fetchReflexDetails = async ({ id }) => {
  try {
    // TODO: add API endpoint
    // return await axiosClient.get(``);
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
