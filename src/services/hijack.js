import axiosClient from 'utils/axiosClient';

export const fetchCredentials = async payload => {
  return await axiosClient.get(`/users/${payload.userId}/hijack/`, {
    baseURL: process.env.REACT_APP_API_URL,
  });
};
