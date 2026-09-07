import { StyleSheet, Text, View, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";

export default function ProfileScreen() {
  // Obtiene la información y las funciones de autenticación.
  const { user, logout } = useAuth();

  // Obtiene la información y funciones del tema.
  const { isDark, colors, toggleTheme } = useTheme();

  // Función encargada de cerrar la sesión y regresar al Login.
  const handleLogout = () => {
    // Limpia la información del usuario.
    logout();

    // Verifica que el contenedor de navegación esté disponible.
    if (navigationRef.isReady()) {
      // Reinicia la navegación y coloca LoginScreen como primera pantalla.
      navigationRef.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Título de la pantalla. */}
      <Text style={[styles.title, { color: colors.text }]}>
        Mi perfil
      </Text>

      {/* Información del usuario. */}
      <Text style={[styles.label, { color: colors.text }]}>
        Correo electrónico:
      </Text>

      <Text style={[styles.value, { color: colors.textSecondary }]}>
        {user?.email}
      </Text>

      <Text style={[styles.label, { color: colors.text }]}>
        Tipo de cuenta:
      </Text>

      <Text style={[styles.value, { color: colors.textSecondary }]}>
        {user?.role}
      </Text>

      {/* Icono representativo del tema actual. */}
      <Ionicons
        name={isDark ? "moon" : "sunny"}
        size={50}
        color={colors.primary}
        style={styles.icon}
      />

      {/* Información del tema. */}
      <Text style={[styles.themeTitle, { color: colors.text }]}>
        Tema actual: {isDark ? "Oscuro" : "Claro"}
      </Text>

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Cambia el tema de la aplicación.
      </Text>

      {/* Switch para alternar entre tema claro y oscuro. */}
      <View style={styles.row}>
        <Text style={[styles.themeLabel, { color: colors.text }]}>
          {isDark
            ? "Desactivar modo oscuro"
            : "Activar modo oscuro"}
        </Text>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? colors.primary : "#f4f3f4"}
          trackColor={{
            false: "#ccc",
            true: colors.primary,
          }}
        />
      </View>

      {/* Botón para cerrar sesión. */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cerrar sesión"
          variant="secondary"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

// Estilos utilizados en la pantalla de perfil.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  icon: {
    marginTop: 30,
    marginBottom: 8,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    marginTop: 5,
  },

  themeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  themeLabel: {
    fontSize: 15,
  },

  buttonContainer: {
    marginTop: 35,
  },
});