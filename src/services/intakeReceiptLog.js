import axiosClient from 'utils/axiosClient';

export const fetchIntakeReceiptLog = async ({ limit, offset }) => {
  try {
    return await axiosClient.get('/intake-logs/', {
      params: {
        limit,
        offset,
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const createIntake = async payload => {
  try {
    const intake = await axiosClient.post('/intake-logs/', { ...payload });
    return intake;
  } catch (error) {
    throw error;
  }
};

export const updateIntake = async payload => {
  try {
    const intake = await axiosClient.patch(`/intake-logs/${payload.id}`, {
      ...payload,
    });
    return intake;
  } catch (error) {
    throw error;
  }
};
