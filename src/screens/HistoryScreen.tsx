import { StyleSheet, Text, View, FlatList } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

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
  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Componente que representa cada viaje del historial.
  const renderTrip = ({ item }: { item: Trip }) => (
    <View
      style={[
        styles.tripCard,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {/* Identificador del viaje. */}
      <Text
        style={[
          styles.tripTitle,
          { color: colors.text },
        ]}
      >
        Viaje {item.id}
      </Text>

      {/* Destino del viaje. */}
      <Text
        style={[
          styles.destination,
          { color: colors.textSecondary },
        ]}
      >
        Destino: {item.destination}
      </Text>

      {/* Estado actual del viaje. */}
      <Text
        style={[
          styles.status,
          { color: colors.primary },
        ]}
      >
        Estado: {item.status}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Título de la pantalla de historial. */}
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Historial de viajes
      </Text>

      {/* Descripción de la función de la pantalla. */}
      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
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
    borderWidth: 1,
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