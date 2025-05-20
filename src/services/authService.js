import api from './api';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout as logoutAction,
  registerStart,
  registerSuccess,
  registerFailure,
} from '../store/slices/authSlice';

// Exporter loginSuccess pour pouvoir l'utiliser dans AppInitializer
export { loginSuccess };

// Since we don't have a backend yet, we'll use mock data
const mockUsers = [
  {
    id: '1',
    name: 'Utilisateur Admin',
    email: 'admin@example.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Utilisateur Régulier',
    email: 'user@example.com',
    role: 'Attendee',
  },
];

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());

    // In a real app, this would be an API call
    // const response = await api.post('/users/login', credentials);

    // Mock login logic
    const { email, password } = credentials;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@example.com' && password === 'password') {
      const user = mockUsers[0];
      const token = 'mock-jwt-token-for-admin';

      dispatch(loginSuccess({ user, token }));
      return { success: true };
    } else if (email === 'user@example.com' && password === 'password') {
      const user = mockUsers[1];
      const token = 'mock-jwt-token-for-user';

      dispatch(loginSuccess({ user, token }));
      return { success: true };
    } else {
      throw new Error('Email ou mot de passe invalide');
    }
  } catch (error) {
    dispatch(loginFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());

    // In a real app, this would be an API call
    // const response = await api.post('/users/register', userData);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock registration logic
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'Attendee',
    };

    const token = `mock-jwt-token-for-${newUser.id}`;

    dispatch(registerSuccess({ user: newUser, token }));
    return { success: true };
  } catch (error) {
    dispatch(registerFailure(error.message));
    return { success: false, error: error.message };
  }
};

export const logout = () => (dispatch) => {
  dispatch(logoutAction());
};
