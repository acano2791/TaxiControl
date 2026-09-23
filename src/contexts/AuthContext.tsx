import { createContext, useContext, useState } from "react";
import { supabase } from "../lib/supabase";

// Roles que podrá tener un usuario dentro de TaxiControl.
export type UserRole = "usuario" | "conductor" | "administrador";

// Información del usuario que mantiene la sesión.
type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
} | null;

// Funciones y datos que estarán disponibles mediante el contexto.
type AuthContextType = {
  user: User;
  register: (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<NonNullable<User>>;
  logout: () => Promise<void>;
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

  // Función que registra un usuario utilizando Supabase Auth
  // y crea su perfil en la tabla profiles.
  const register = async (
    email: string,
    password: string,
    name: string,
    phone: string
  ) => {
    // Crea la cuenta de autenticación en Supabase.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("No se pudo obtener el usuario registrado.");
    }

    // Crea el perfil del usuario en la tabla profiles.
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        email: data.user.email ?? email,
        name,
        phone,
        role: "usuario",
      });

    if (profileError) {
      throw profileError;
    }

    // Actualiza el usuario dentro del contexto de autenticación.
    setUser({
      id: data.user.id,
      email: data.user.email ?? email,
      name,
      phone,
      role: "usuario",
    });
  };

  // Inicia sesión utilizando Supabase Auth.
  const login = async (
    email: string,
    password: string
  ): Promise<NonNullable<User>> => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error("No se pudo obtener el usuario.");
    }

    // Obtiene el perfil completo del usuario desde Supabase.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, name, phone, role")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Actualiza el usuario dentro del contexto.
    const authenticatedUser: NonNullable<User> = {
      id: data.user.id,
      email: profile.email ?? data.user.email ?? email,
      name: profile.name ?? "",
      phone: profile.phone ?? "",
      role: profile.role as UserRole,
    };

    setUser(authenticatedUser);

    return authenticatedUser;
  };

  // Cierra la sesión utilizando Supabase Auth.
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};