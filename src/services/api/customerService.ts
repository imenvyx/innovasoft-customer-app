import api from './axiosConfig';
import {
  Customer,
  CustomerListItem,
  CustomerFilters,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Interest,
} from '../../interfaces/customer';

export const getCustomers = async (filters: CustomerFilters): Promise<CustomerListItem[]> => {
  const response = await api.post<CustomerListItem[]>('/api/Cliente/Listado', filters);
  return response.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
  const response = await api.get<Customer>(`/api/Cliente/Obtener/${id}`);
  return response.data;
};

export const createCustomer = async (customer: CreateCustomerRequest): Promise<void> => {
  await api.post('/api/Cliente/Crear', customer);
};

export const updateCustomer = async (customer: UpdateCustomerRequest): Promise<void> => {
  await api.post('/api/Cliente/Actualizar', customer);
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/api/Cliente/Eliminar/${id}`);
};

export const getInterests = async (): Promise<Interest[]> => {
  const response = await api.get<Interest[]>('/api/Intereses/Listado');
  return response.data;
};
