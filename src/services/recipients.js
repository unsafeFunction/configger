import axiosClient from 'utils/axiosClient';

export const loadRecipients = async query => {
  try {
    const campaigns = await axiosClient.get('/sms-offers', {
      params: { ...query },
    });

    return campaigns;
  } catch (error) {
    return error;
  }
};

export const deleteRecipient = async id => {
  try {
    const campaigns = await axiosClient.delete(`/sms-offers/${id}`);

    return campaigns;
  } catch (error) {
    return error;
  }
};

export const createRecipient = async payload => {
  try {
    const campaign = await axiosClient.post(`/sms-offers`, payload);

    return campaign;
  } catch (error) {
    return error;
  }
};
