import { request } from './http';

export const handleSignup = async (username, email, password, fullName) => {
  try {
    const response = await request('post', '/auth/signup', {
      username,
      email,
      password,
      fullName,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error during signup:', error);
    return {
      success: false,
      error: error.response?.data || 'Unknown error occurred',
    };
  }
};

export const handleLogin = async (username, password) => {
  try {
    const response = await request('post', '/auth/login', {
      username,
      password,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      error: error.response?.data || 'Unknown error occurred',
    };
  }
};
