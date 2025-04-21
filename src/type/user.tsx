export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  password?: string
  email: string;
  role?: string;
  phoneNumber?: number;
  seniority?: string;
  commissionRate?: number;
}