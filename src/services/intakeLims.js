import axiosClient from 'utils/axiosClient';

export const fetchIntake = async ({ limit, offset }) => {
  try {
    return await axiosClient.get('/companies/packing-slips/', {
      params: {
        limit,
        offset,
      },
      baseURL: process.env.REACT_APP_API_URL,
    });
  } catch (error) {
    return error;
  }
};
