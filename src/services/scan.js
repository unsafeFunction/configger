import axiosClient from 'utils/axiosClient';

export const fetchCompanies = async ({ limit, offset, search }) => {
  const companies = await axiosClient.get('/companies/', {
    params: {
      limit,
      offset,
      search,
    },
  });

  return companies;
};
