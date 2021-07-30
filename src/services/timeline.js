import axiosClient from 'utils/axiosClient';

export const loadTimeline = async (query) => {
  try {
    const timeline = await axiosClient.get('/timeline/', {
      params: { ...query },
    });
    return timeline;
  } catch (error) {
    return error;
  }
};
