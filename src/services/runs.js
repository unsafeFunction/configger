import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchRuns = async (query) => {
  try {
    const runs = await axiosClient.get('/pool-batches/', {
      params: {
        ...query,
      },
    });
    return runs;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const publishRun = async (payload) => {
  try {
    const run = await axiosClient.patch(`/pool-batches/${payload.runId}/`, {
      is_published: payload.isPublished,
    });
    return run;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
