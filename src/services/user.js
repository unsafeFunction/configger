import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const login = async (username, password) => {
  try {
    const login = await axiosClient.post('/rest-auth/login/', {
      username,
      password,
    });
    return login;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const forgotPassword = async (email) => {
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

export const fetchUserById = async (id) => {
  return await axiosClient.get(`/users/${id}/`);
};

export const verifyEmail = async (inviteKey) => {
  const verifyEmail = await axiosClient.post(
    '/rest-auth/registration/verify-email/',
    { key: inviteKey },
  );

  return verifyEmail;
};

export const regByEmail = async (values) => {
  const regByEmail = await axiosClient.post('/rest-auth/registration/', {
    ...values,
  });

  return regByEmail;
};
