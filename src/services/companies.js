import axiosClient from 'utils/axiosClient';

export const fetchCompanies = async ({ limit, offset, search }) => {
  try {
    return await axiosClient.get('/companies-short/', {
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

export const createCompany = async (payload) => {
  const company = await axiosClient.post(`/companies/create`, {
    ...payload,
  });

  return company;
};

export const getSingleCompany = async (id) => {
  try {
    const company = await axiosClient.get(`/companies/${id}/`);

    return company;
  } catch (error) {
    return error;
  }
};

export const fetchCompanyShort = async (id) => {
  try {
    const company = await axiosClient.get(`/companies-short/${id}/`);
    return company;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};

export const updateUsers = async (payload) => {
  try {
    const users = await axiosClient.patch(`/companies/${payload.id}/`, {
      results_contacts: payload.results_contacts,
    });

    return users;
  } catch (error) {
    return error;
  }
};
