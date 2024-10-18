import { request } from './http';

export const handleSignup = async (fullName, username, email, password, role) => {
  try {
    const response = await request('post', '/auth/signup', {
      fullName,
      username,
      email,
      password,
      role,
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

export const handleLogin = async (data) => {
  try {
    const response = await request('post', '/auth/login', {
      ...data, // Sending username and password as payload
    });

    const { token, user } = response.data;

    return { success: true, data: { token, user } };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      error: error.response?.data || 'Unknown error occurred',
    };
  }
};
