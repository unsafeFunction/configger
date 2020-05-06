import axiosClient from 'utils/axiosClient';

export const loadRecipients = async query => {
  try {
    const recipients = await axiosClient.get('/sms-offers', {
      params: { ...query },
    });

    return recipients;
  } catch (error) {
    return error;
  }
};

export const getSingleRecipient = async id => {
  try {
    const recipient = await axiosClient.get(`/sms-offers/${id}`);

    return recipient;
  } catch (error) {
    return error;
  }
};

export const deleteRecipient = async id => {
  try {
    const recipients = await axiosClient.delete(`/sms-offers/${id}`);

    return recipients;
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

export const updateRecipient = async payload => {
  try {
    const campaign = await axiosClient.put(
      `/sms-offers/${payload.id}`,
      payload,
    );

    return campaign;
  } catch (error) {
    return error;
  }
};
