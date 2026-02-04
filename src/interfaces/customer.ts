// Customer Interfaces
export interface Interest {
  id: string;
  descripcion: string;
}

export interface Customer {
  id: string;
  /** @max 50 */
  nombre: string;
  /** @max 100 */
  apellidos: string;
  /** @max 20 */
  identificacion: string;
  /** @max 20 */
  telefonoCelular: string;
  /** @max 20 */
  otroTelefono: string;
  /** @max 200 */
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  /** @max 1 */
  sexo: 'M' | 'F';
  /** @max 200 */
  resenaPersonal: string;
  imagen?: string;
  /** @max 50 */
  interesesId: string;
  interesFK?: Interest;
}

export interface CustomerListItem {
  id: string;
  identificacion: string;
  nombre: string;
  apellidos: string;
}

export interface CustomerFilters {
  identificacion?: string;
  nombre?: string;
  usuarioId: string;
}

export interface CreateCustomerRequest {
  /** @max 50 */
  nombre: string;
  /** @max 100 */
  apellidos: string;
  /** @max 20 */
  identificacion: string;
  /** @max 20 */
  celular: string;
  /** @max 20 */
  otroTelefono: string;
  /** @max 200 */
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  /** @max 1 */
  sexo: string;
  /** @max 200 */
  resennaPersonal?: string | null;
  imagen?: string | null;
  /** @max 50 */
  interesFK: string;
  usuarioId: string;
}

export interface UpdateCustomerRequest {
  id: string;
  /** @max 50 */
  nombre: string;
  /** @max 100 */
  apellidos: string;
  /** @max 20 */
  identificacion: string;
  /** @max 20 */
  celular: string;
  /** @max 20 */
  otroTelefono: string;
  /** @max 200 */
  direccion: string;
  fNacimiento: string;
  fAfiliacion: string;
  /** @max 1 */
  sexo: string;
  /** @max 200 */
  resennaPersonal?: string | null;
  imagen?: string | null;
  /** @max 50 */
  interesFK: string;
  usuarioId: string;
}

export interface CustomerFormData {
  /** @max 50 */
  nombre: string;
  /** @max 100 */
  apellidos: string;
  /** @max 20 */
  identificacion: string;
  /** @max 20 */
  telefonoCelular: string;
  /** @max 20 */
  otroTelefono: string;
  /** @max 200 */
  direccion: string;
  /** @max 1 */
  sexo: string;
  /** @max 200 */
  resenaPersonal: string;
  imagen?: string;
  /** @max 50 */
  interesesFK: string;
  usuarioId: string;
}
