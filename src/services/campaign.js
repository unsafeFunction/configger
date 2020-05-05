import axiosClient from 'utils/axiosClient';
import moment from 'moment';

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

export const startCampaign = async payload => {
  try {
    const campaign = await axiosClient.put(
      `/campaigns/${payload.id}/start?startDateTime=${payload.startDateTime ||
        moment.utc(moment()).add(30, 's')}`,
    );

    return campaign;
  } catch (error) {
    return error;
  }
};
