import axiosClient from 'utils/axiosClient';

export const loadCampaigns = async query => {
  try {
    const campaigns = await axiosClient.get('/campaigns', {
      params: { ...query },
    });

    return campaigns;
  } catch (error) {
    return error;
  }
};

export const deleteCampaign = async id => {
  try {
    const campaigns = await axiosClient.delete(`/campaigns/${id}`);

    return campaigns;
  } catch (error) {
    return error;
  }
};

export const createCampaign = async payload => {
  try {
    const campaign = await axiosClient.post(`/campaigns`, {
      ...payload,
      originalLink: `https://${payload.originalLink}`,
    });

    return campaign;
  } catch (error) {
    return error;
  }
};
