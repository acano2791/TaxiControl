import { StyleSheet, Text, View } from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      {/* Título de la pantalla de historial. */}
      <Text style={styles.title}>Historial de viajes</Text>

      {/* Mensaje que indica que aquí se mostrarán los viajes realizados. */}
      <Text style={styles.subtitle}>
        Aquí podrás consultar tus viajes realizados
      </Text>
    </View>
  );
}

// Estilos de la pantalla de historial.
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