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

export const fetchUsers = async query => {
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
