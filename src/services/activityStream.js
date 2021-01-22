import axiosClient from 'utils/axiosClient';

export const fetchActivityByUserId = async ({
  userId,
  limit,
  offset,
  from,
  to,
}) => {
  return await axiosClient.get(`/users/${userId}/activity/`, {
    params: {
      limit,
      offset,
      from,
      to,
    },
  });
};
