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
    const response = await axiosClient.post('/auth/refresh-token', {
      refreshToken,
    });

    cookie.setItem('accessToken', response.data.key);
    cookie.setItem('refreshToken', response.data.refreshToken);

    return response;
  } catch (error) {
    return error;
  }
};
