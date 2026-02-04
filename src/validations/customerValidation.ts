import { z } from 'zod';

export type CustomerFormData = z.infer<typeof customerSchema>;
export type CustomerFiltersData = z.infer<typeof customerFiltersSchema>;

export const customerSchema = z.object({
  nombre: z.string().min(1, 'Nombre es requerido').max(50, 'Nombre máximo 50 caracteres'),
  apellidos: z.string().min(1, 'Apellidos son requeridos').max(100, 'Apellidos máximo 100 caracteres'),
  identificacion: z.string().min(1, 'Identificación es requerida').max(20, 'Identificación máximo 20 caracteres'),
  telefonoCelular: z.string().min(1, 'Teléfono celular es requerido').max(20, 'Teléfono máximo 20 caracteres'),
  otroTelefono: z.string().min(1, 'Otro Teléfono es requerido').max(20, 'Otro teléfono máximo 20 caracteres').optional(),
  direccion: z.string().min(1, 'Dirección es requerida').max(200, 'Dirección máximo 200 caracteres'),
  fNacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
  fAfiliacion: z.string().min(1, 'Fecha de afiliación es requerida'),
  sexo: z.string().regex(/^[MF]$/, 'Sexo debe ser M o F'),
  resenaPersonal: z.string().min(1, 'La reseña personal es requerida').max(200, 'Reseña personal máximo 200 caracteres').optional(),
  imagen: z.string().optional(),
  interesesId: z.string().min(1, 'Interés es requerido'),
});

export const customerFiltersSchema = z.object({
  identificacion: z.string().optional(),
  nombre: z.string().optional(),
  usuarioId: z.string(),
});
