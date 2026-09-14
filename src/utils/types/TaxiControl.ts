export type UserRole =
  | "usuario"
  | "conductor"
  | "administrador";

export type User = {
  email: string;
  role: UserRole | null;
};