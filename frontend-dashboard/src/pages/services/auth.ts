import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/`;

interface AuthResponse {
  access: string;
  refresh: string;
}

interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  photo?: string;
  role?: string;
  is_superuser?: boolean;
}

// Configuración de Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para añadir token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string): Promise<{tokens: AuthResponse, user: UserData}> => {
  try {
    // 1. Obtener tokens JWT
    const response = await api.post<AuthResponse>('token/', { username, password });
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);

    // 2. Obtener datos del usuario actual
    const userId = jwtDecode<{ user_id: number }>(response.data.access).user_id;
    const userResponse = await api.get<UserData>(`users/${userId}/`);
    localStorage.setItem('currentUser', JSON.stringify(userResponse.data));

    return {
      tokens: response.data,
      user: userResponse.data
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<UserData> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('No autenticado');

  try {
    const userId = jwtDecode<{ user_id: number }>(token).user_id;
    const response = await api.get<UserData>(`users/${userId}/`);
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: number, data: FormData | Partial<UserData>): Promise<UserData> => {
  try {
    const config = {
      headers: {} as Record<string, string>
    };

    if (data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.patch<UserData>(`users/${userId}/`, data, config);
    localStorage.setItem('currentUser', JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
};