import { StyleSheet, Text, View, FlatList } from "react-native";

// Tipo de dato que representa un viaje.
type Trip = {
  id: string;
  destination: string;
  status: string;
};

// Datos locales de ejemplo para mostrar el historial.
const trips: Trip[] = [
  {
    id: "1",
    destination: "Mall Multiplaza",
    status: "Completado",
  },
  {
    id: "2",
    destination: "Centro de la ciudad",
    status: "Completado",
  },
  {
    id: "3",
    destination: "Universidad",
    status: "Completado",
  },
];

// Pantalla que muestra el historial de viajes.
export default function HistoryScreen() {
  // Componente que representa cada viaje del historial.
  const renderTrip = ({ item }: { item: Trip }) => (
    <View style={styles.tripCard}>
      {/* Identificador del viaje. */}
      <Text style={styles.tripTitle}>
        Viaje {item.id}
      </Text>

      {/* Destino del viaje. */}
      <Text style={styles.destination}>
        Destino: {item.destination}
      </Text>

      {/* Estado actual del viaje. */}
      <Text style={styles.status}>
        Estado: {item.status}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Título de la pantalla de historial. */}
      <Text style={styles.title}>Historial de viajes</Text>

      {/* Descripción de la función de la pantalla. */}
      <Text style={styles.subtitle}>
        Aquí puedes consultar tus viajes realizados
      </Text>

      {/* Lista de viajes registrados localmente. */}
      <FlatList
        data={trips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Estilos utilizados en la pantalla de historial.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
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
    marginBottom: 25,
  },

  list: {
    width: "100%",
  },

  tripCard: {
    backgroundColor: "#F4F6F8",
    borderWidth: 1,
    borderColor: "#D5DCE3",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  destination: {
    fontSize: 15,
    marginBottom: 6,
  },

  status: {
    fontSize: 14,
    fontWeight: "600",
  },
});