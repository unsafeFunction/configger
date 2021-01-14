import axiosClient from 'utils/axiosClient';

export const fetchIntake = async () => {
  try {
    return await axiosClient.get('/intake');
  } catch (error) {
    return error;
  }
};
