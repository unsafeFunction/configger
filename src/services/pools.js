import axiosClient from 'utils/axiosClient';
// import cookieStorage from 'utils/cookie';

// const cookie = cookieStorage();

export const fetchPoolsByRunId = async ({ runId, limit, offset, search }) => {
  try {
    const pools = await axiosClient.get(`/pool-batches/${runId}/pools/`, {
      params: {
        limit,
        offset,
        search,
      },
    });
    return pools;
  } catch (error) {
    return error;
  }
};

export const fetchPoolsByCompanyId = async ({
  companyId,
  limit,
  offset,
  search,
}) => {
  try {
    const pools = await axiosClient.get(`/companies/${companyId}/pools/`, {
      params: {
        limit,
        offset,
        search,
      },
    });
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

export const fetchResultList = async payload => {
  try {
    const resultList = await axiosClient.get(`/pools/test-result-choices/`);
    return resultList;
  } catch (error) {
    return error;
  }
};

export const updatePoolResult = async payload => {
  try {
    const pool = await axiosClient.patch(`/pools/${payload.poolId}/`, {
      result: payload.result,
    });
    return pool;
  } catch (error) {
    return error;
  }
};
