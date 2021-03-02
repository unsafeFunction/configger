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
    const intake = await axiosClient.post('/intake-logs/', {
      ...payload,
      reference_pools_count: parseInt(payload.reference_pools_count, 10),
      reference_samples_count: parseInt(payload.reference_samples_count, 10),
    });
    return intake;
  } catch (error) {
    throw new Error(error);
  }
};
