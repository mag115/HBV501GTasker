import { request } from './http';

// Handle Signup with role
export const handleSignup = async (username, email, password, fullName, role) => {
  try {
    const response = await request('post', '/auth/signup', {
      username,
      email,
      password,
      fullName,
      role, // Include role in the signup request
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

// Handle Login and return token and user info including role
export const handleLogin = async (data) => {
  try {
    const response = await request('post', '/auth/login', {
      ...data, // Sending username and password as payload
    });

    const { token, role } = response.data; // Extract role from login response

    return { success: true, data: { token, role } }; // Include role in the return data
  } catch (error) {
    console.error('Error during login:', error);
    return {
      success: false,
      error: error.response?.data || 'Unknown error occurred',
    };
  }
};
