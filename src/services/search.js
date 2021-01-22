import axiosClient from 'utils/axiosClient';

export const fetchInfo = async ({ search }) => {
  try {
    const searchInfo = await axiosClient.get(`/pools/search`, {
      params: {
        tube_id: search,
      },
    });
    return searchInfo;
  } catch (error) {
    return error?.response?.data?.error;
  }
};
