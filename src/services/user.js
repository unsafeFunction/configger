import axiosClient from 'utils/axiosClient';

export const login = async (username, password) => {
  const login = await axiosClient.post('/rest-auth/login/', {
    username,
    password,
  });

  return login;
};

export const forgotPassword = async email => {
  const restore = await axiosClient.post('rest-auth/password/reset/', {
    email,
  });

  return restore;
};

export const restore = async (new_password1, new_password2, uid, token) => {
  const restore = await axiosClient.post('rest-auth/password/reset/confirm/', {
    new_password1,
    new_password2,
    uid,
    token,
  });

  return restore;
};

export const accept = async () => {
  const accept = await axiosClient.patch('/me/', {
    terms_accepted: true,
  });

  return accept;
};

export const getProfile = async () => {
  const profile = await axiosClient.get('/me/');

  return profile;
};

export const updateProfile = async (first_name, last_name, phone_number) => {
  const update = await axiosClient.patch('/me/', {
    first_name,
    phone_number: phone_number ? `+1${phone_number.replace(/[^\d]/g, '')}` : '',
    last_name,
  });

  return update;
};

export const changePassword = async (
  old_password,
  new_password1,
  new_password2,
) => {
  const update = await axiosClient.post('/rest-auth/password/change/', {
    old_password,
    new_password1,
    new_password2,
  });

  return update;
};

export const loadCompanies = async (page, search) => {
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
  const invite = await axiosClient.post(`/users/${id}/reinvite/`);

  return invite;
};

export const inviteCustomer = async values => {
  const invite = await axiosClient.post('/rest-auth/registration/', {
    ...values,
  });

  return invite;
};

export const fetchUserById = async id => {
  return await axiosClient.get(`/users/${id}/`);
};
