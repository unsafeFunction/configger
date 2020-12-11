import axiosClient from 'utils/axiosClient';

export const fetchRuns = async query => {
  try {
    const runs = await axiosClient.get('/pool-batches/', {
      params: {
        ...query,
      },
    });
    return runs;
  } catch (error) {
    return error;
  }
};

export const publishRun = async payload => {
  try {
    const run = await axiosClient.patch(`/pool-batches/${payload.runId}/`, {
      is_published: payload.isPublished,
    });
    return run;
  } catch (error) {
    return error;
  }
};
