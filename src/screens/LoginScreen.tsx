import { StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      {/* Título principal de la pantalla de inicio de sesión */}
      <Text style={styles.title}>TaxiControl</Text>

      {/* Texto que indica la función de la pantalla */}
      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>
    </View>
  );
}

// Estilos de la pantalla de inicio de sesión.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
  },
});