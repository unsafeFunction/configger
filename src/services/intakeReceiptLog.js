import axiosClient from 'utils/axiosClient';

export const fetchIntakeReceiptLog = async (query) => {
  try {
    return await axiosClient.get('/intake-logs/', {
      params: { ...query },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const createIntake = async (payload) => {
  try {
    const intake = await axiosClient.post('/intake-logs/', {
      ...payload,
      tracking_numbers: payload.tracking_numbers[0].length
        ? payload.tracking_numbers
        : undefined,
    });
    return intake;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};

export const updateIntake = async (payload) => {
  try {
    const intake = await axiosClient.patch(`/intake-logs/${payload.id}`, {
      ...payload,
      tracking_numbers: payload.tracking_numbers[0].length
        ? payload.tracking_numbers
        : undefined,
    });
    return intake;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};
