import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function HomeScreen() {
  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Título de la pantalla principal */}
      <Text style={[styles.title, { color: colors.text }]}>
        Bienvenido a TaxiControl
      </Text>

      {/* Descripción de la función principal de la aplicación */}
      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Gestión y localización de taxis
      </Text>
    </View>
  );
}

// Estilos de la pantalla principal.
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
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});