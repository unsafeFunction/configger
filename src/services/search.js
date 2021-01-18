import axiosClient from 'utils/axiosClient';
import { notification } from 'antd';

export const fetchInfo = async ({ search }) => {
  try {
    const searchInfo = await axiosClient.get(`/pools/search`, {
      params: {
        tube_id: search,
      },
    });
    return searchInfo;
  } catch (error) {
    notification.error({message: error?.response?.data?.error});
    return error?.response?.data?.error;
  }
};
