import axiosClient from 'utils/axiosClient';
// import cookieStorage from 'utils/cookie';

// const cookie = cookieStorage();

export const fetchPoolsByBatchId = async payload => {
  try {
    const pools = await axiosClient.get(`/pool-batches/${payload.batchId}/`, {
      params: {
        limit: payload.limit,
      },
    });
    return pools;
  } catch (error) {
    return error;
  }
};

export const fetchPoolsByCompanyId = async payload => {
  try {
    const pools = await axiosClient.get(
      `/companies/${payload.companyId}/pools/`,
      {
        params: {
          limit: payload.limit,
        },
      },
    );
    return pools;
  } catch (error) {
    return error;
  }
};

export const publishPool = async payload => {
  try {
    const pool = await axiosClient.patch(`/pools/${payload.poolId}/`, {
      is_published: payload.isPublished,
    });
    return pool;
  } catch (error) {
    return error;
  }
};
