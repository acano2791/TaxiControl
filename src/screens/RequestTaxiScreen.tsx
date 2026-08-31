import { StyleSheet, Text, View } from "react-native";

export default function RequestTaxiScreen() {
  return (
    <View style={styles.container}>
      {/* Título de la pantalla para solicitar un taxi. */}
      <Text style={styles.title}>Solicitar taxi</Text>

      {/* Descripción de la función que tendrá esta pantalla. */}
      <Text style={styles.subtitle}>
        Encuentra un taxi cercano a tu ubicación
      </Text>
    </View>
  );
}

// Estilos de la pantalla para solicitar taxi.
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
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});