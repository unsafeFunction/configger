import axiosClient from 'utils/axiosClient';

export const fetchCustomers = async ({ limit, offset, search }) => {
  const users = await axiosClient.get('/users/', {
    params: {
      limit,
      offset,
      search,
    },
    baseURL: process.env.REACT_APP_API_URL,
  });
  return users;
};

export const fetchCompanies = async (page, search) => {
  const limit = 30;
  const companies = await axiosClient.get('/companies/', {
    params: {
      limit,
      offset: limit * (page - 1),
      search,
    },
    baseURL: process.env.REACT_APP_API_URL,
  });

  return companies;
};

export const toggleUser = async (id, is_active) => {
  const status = await axiosClient.patch(`/users/${id}/`, {
    is_active,
  }, {
    baseURL: process.env.REACT_APP_API_URL,
  });

  return status;
};

export const reinviteUser = async id => {
  const invite = await axiosClient.post(`/users/${id}/reinvite/`, {}, {
    baseURL: process.env.REACT_APP_API_URL,
  });

  return invite;
};

export const inviteCustomer = async values => {
  const invite = await axiosClient.post('/rest-auth/registration/', {
    ...values,
  });

  return invite;
};
