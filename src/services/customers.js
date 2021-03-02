import axiosClient from 'utils/axiosClient';

export const fetchCustomers = async ({ limit, offset, search }) => {
  const users = await axiosClient.get('/users/', {
    params: {
      limit,
      offset,
      search,
    },
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
  });

  return companies;
};

export const toggleUser = async (id, is_active) => {
  const status = await axiosClient.patch(`/users/${id}/`, {
    is_active,
  });

  return status;
};

export const reinviteUser = async id => {
  const invite = await axiosClient.post(`/users/${id}/reinvite/`, {});

  return invite;
};

export const inviteCustomer = async values => {
  const invite = await axiosClient.post('/rest-auth/registration/', {
    ...values,
  });

  return invite;
};
