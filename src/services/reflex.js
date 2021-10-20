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

export const updateSample = async ({ id, isCompleted }) => {
  try {
    const sample = await axiosClient.put(`/runs/results/rerun/${id}`, {
      isCompleted,
    });
    return sample;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const fetchReflexDetails = async ({ id }) => {
  try {
    return await axiosClient.get(`/runs/results/rerun/${id}/comapre`);
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
