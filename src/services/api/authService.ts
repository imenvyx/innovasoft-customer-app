import api from './axiosConfig';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from '../../interfaces/auth';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/api/Authenticate/login', credentials);
  return response.data;
};

export const register = async (userData: RegisterRequest): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>('/api/Authenticate/register', userData);
  return response.data;
};
