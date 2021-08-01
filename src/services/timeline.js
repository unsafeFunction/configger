import axiosClient from 'utils/axiosClient';

export const loadTimeline = async (id) => {
  try {
    const timeline = await axiosClient.get(`/runs/${id}/timeline`);
    return timeline;
  } catch (error) {
    return error;
  }
};
