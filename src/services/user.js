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

export const fetchUserById = async id => {
  return await axiosClient.get(`/users/${id}/`);
};

export const verifyEmail = async inviteKey => {
  const verifyEmail = await axiosClient.post(
    '/rest-auth/registration/verify-email/',
    { key: inviteKey },
  );

  return verifyEmail;
};

export const regByEmail = async (password1, password2, inviteKey) => {
  const regByEmail = await axiosClient.post('/rest-auth/reg/password/change/', {
    new_password1: password1,
    new_password2: password2,
    key: inviteKey,
  });

  return regByEmail;
};
