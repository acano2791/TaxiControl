import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Título de la pantalla principal */}
      <Text style={styles.title}>Bienvenido a TaxiControl</Text>

      {/* Descripción de la función principal de la aplicación */}
      <Text style={styles.subtitle}>
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