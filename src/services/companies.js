import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchCompanies = async (params) => {
  try {
    return await axiosClient.get('/companies/', {
      params,
    });
  } catch (error) {
    throw new Error(errorOutput(error));
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
