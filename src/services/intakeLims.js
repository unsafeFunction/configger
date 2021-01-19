import axiosClient from 'utils/axiosClient';

export const fetchIntake = async () => {
  try {
    return await axiosClient.get('/companies/packing-slips/');
  } catch (error) {
    return error;
  }
};
