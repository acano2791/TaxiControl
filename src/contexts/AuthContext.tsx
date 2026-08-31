import { createContext, useContext, useState } from "react";

// Roles que podrá tener un usuario dentro de TaxiControl.
export type UserRole = "usuario" | "conductor" | "administrador";

// Información básica del usuario que mantiene la sesión.
type User = {
  email: string;
  role: UserRole;
} | null;

// Funciones y datos que estarán disponibles mediante el contexto.
type AuthContextType = {
  user: User;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
};

// Creación del contexto de autenticación.
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para utilizar el contexto desde las pantallas.
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
};

// Provider encargado de administrar el estado global de la sesión.
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Estado que almacena el usuario actualmente autenticado.
  const [user, setUser] = useState<User>(null);

  // Función que inicia la sesión del usuario.
  const login = (email: string, role: UserRole) => {
    setUser({
      email,
      role,
    });
  };

  // Función que cierra la sesión del usuario.
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};