import axios from 'axios';
import cookieStorage from 'utils/cookie';

const cookie = cookieStorage();

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: cookie.getItem('accessToken'),
  },
});

API.interceptors.request.use(
  (config) => {
    const storedToken = cookie.getItem('accessToken');
    if (!config.headers.authorization && storedToken) {
      config.headers.Authorization = `Token ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// If we realise refresh token this should be uncommented

// API.interceptors.response.use(
//   response => {
//     return response;
//   },
//   async error => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 || error.response.status === 403) {
//       const response = await refresh(cookie.getItem('refreshToken'));
//       originalRequest.headers.Authorization = response.data.key;
//       const retryOriginalRequest = new Promise(resolve => {
//         resolve(axios(originalRequest));
//       });

//       return retryOriginalRequest;
//     }
//     return Promise.reject(error);
//   },
// );

export default API;
