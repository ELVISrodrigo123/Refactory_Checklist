export interface CustomUser {
  id: number;
  username: string;
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  identity_card: string;
  phone_number: string;
  photo: string | File | null;
  shift_type: 'Día' | 'Noche';
  shift_group: 1 | 2 | 3 | 4;
  role: 'jefe_area' | 'capataz' | 'operador';
}