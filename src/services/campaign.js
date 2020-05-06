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

export const getStatistics = async id => {
  try {
    const statistics = await axiosClient.get(`/campaigns/${id}/statistics`);

    return statistics;
  } catch (error) {
    return error;
  }
};

export const getSingleCampaign = async id => {
  try {
    const campaign = await axiosClient.get(`/campaigns/${id}`);

    return campaign;
  } catch (error) {
    return error;
  }
};

export const startCampaign = async payload => {
  try {
    const campaign = await axiosClient.put(
      `/campaigns/${payload.id}/start`,
      null,
      {
        params: payload.startDateTime
          ? {
              startDateTime:
                payload.startDateTime && payload.startDateTime.toISOString(),
            }
          : {},
      },
    );

    return campaign;
  } catch (error) {
    return error;
  }
};
