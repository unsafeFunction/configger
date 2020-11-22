import axiosClient from 'utils/axiosClient';
import cookieStorage from 'utils/cookie';

const cookie = cookieStorage();

export const login = async (username, password) => {
  const login = await axiosClient.post('/rest-auth/login/', {
    username,
    password,
  });

  return login;
};

export const restore = async email => {
  const restore = await axiosClient.post('rest-auth/password/reset/', {
    email,
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

export const updateProfile = async (first_name, last_name) => {
  const update = await axiosClient.patch('/me/', {
    first_name,
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

export const refresh = async refreshToken => {
  try {
    // const response = await axiosClient.post('/auth/refresh-token', {
    //   refreshToken,
    // });
    return null;
  } catch (error) {
    return error;
  }
};

export const loadUsers = async query => {
  try {
    const users = await axiosClient.get('/users/', {
      params: {
        ...query,
      },
    });

    return users;
  } catch (error) {
    return error;
  }
};
