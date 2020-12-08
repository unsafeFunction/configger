import axiosClient from 'utils/axiosClient';
// import cookieStorage from 'utils/cookie';

// const cookie = cookieStorage();

export const fetchBatches = async query => {
  try {
    const batches = await axiosClient.get('/pool-batches/', {
      params: {
        ...query,
      },
    });
    return batches;
  } catch (error) {
    return error;
  }
};

export const publishBatch = async payload => {
  try {
    const batch = await axiosClient.patch(`/pool-batches/${payload.batchId}/`, {
      is_published: payload.isPublished,
    });
    return batch;
  } catch (error) {
    return error;
  }
};
