import axiosClient from 'utils/axiosClient';

export const fetchCompanies = async ({ limit, offset, search }) => {
  try {
    return await axiosClient.get('/companies/', {
      params: {
        limit,
        offset,
        search,
      },
    });
  } catch (error) {
    return error;
  }
};

export const createCompany = async payload => {
  const company = await axiosClient.post(`/companies/create`, {
    ...payload,
  });

  return company;
};

export const getSingleCompany = async id => {
  try {
    const campaign = await axiosClient.get(`/companies/${id}/`);

    return campaign;
  } catch (error) {
    return error;
  }
};
