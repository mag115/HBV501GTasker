import { request } from './http';

// Handle user signup
export const handleSignup = async (username, email, password, fullName, role) => {
  try {
    const response = await request('post', '/auth/signup', {
      username,
      email,
      password,
      fullName,
      role,  // Send role as a string directly
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

// Handle user login
export const handleLogin = async (data) => {
  try {
    const response = await request('post', '/auth/login', {
      ...data,
    });

    const { token, role } = response.data;  // Extract role as a string from the response
    console.log('Login response:', response.data);

    return { success: true, data: { token, role } };  // Return both token and role as strings
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      error: error.response?.data || 'Unknown error occurred',
    };
  }
};
