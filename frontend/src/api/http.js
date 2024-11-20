import axios from 'axios';

axios.defaults.baseURL = 'https://hbv501gtasker-1.onrender.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('token', token);

    if (
      !config.url.includes('/auth/login') &&
      !config.url.includes('/auth/signup') &&
      token
    ) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const request = (method, url, data) => {
  return axios({
    method: method,
    url: url,
    data: data,
  });
};
