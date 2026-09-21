export type UserRole =
  | "usuario"
  | "conductor"
  | "administrador";

export type User = {
  email: string;
  name: string;
  phone: string;
  role: UserRole | null;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
};