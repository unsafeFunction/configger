import axiosClient from 'utils/axiosClient';

export const fetchIntake = async ({ limit, offset }) => {
  try {
    return await axiosClient.get('/companies/packing-slips/', {
      params: {
        limit,
        offset,
      },
    });
  } catch (error) {
    return error;
  }
};
