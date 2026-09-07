import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";
import { useTheme } from "../contexts/ThemeContext";

export default function ProfileScreen() {
  // Obtiene la información y las funciones de autenticación del contexto.
  const { user, logout } = useAuth();

  // Obtiene la información y funciones del tema.
  const { colors, isDark, toggleTheme } = useTheme();

  // Función encargada de cerrar la sesión y regresar al Login.
  const handleLogout = () => {
    // Limpia la información del usuario almacenada en el contexto.
    logout();

    // Verifica que el contenedor de navegación esté disponible.
    if (navigationRef.isReady()) {
      // Reinicia el historial de navegación y coloca LoginScreen como primera pantalla.
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
      {/* Título de la pantalla de perfil. */}
      <Text style={[styles.title, { color: colors.text }]}>
        Mi perfil
      </Text>

      {/* Muestra el correo almacenado en el contexto. */}
      <Text style={[styles.label, { color: colors.text }]}>
        Correo electrónico:
      </Text>

      <Text style={[styles.value, { color: colors.textSecondary }]}>
        {user?.email}
      </Text>

      {/* Muestra el rol almacenado en el contexto. */}
      <Text style={[styles.label, { color: colors.text }]}>
        Tipo de cuenta:
      </Text>

      <Text style={[styles.value, { color: colors.textSecondary }]}>
        {user?.role}
      </Text>

      {/* Botón para cambiar entre tema claro y oscuro. */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title={isDark ? "☀️ Tema claro" : "🌙 Tema oscuro"}
          onPress={toggleTheme}
        />
      </View>

      {/* Botón que permite cerrar sesión. */}
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
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
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

  buttonContainer: {
    marginTop: 30,
  },
});