import { StyleSheet, Text, View, FlatList } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext"

// Tipo de dato que representa un viaje.
type Trip = {
  id: string;
  destination: string;
  status: string;
  started_at: string | null;
  completed_at: string | null;  
};

// Pantalla que muestra el historial de viajes.
export default function HistoryScreen() {
  // Obtiene los colores del tema actual.
  const { colors } = useTheme();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);

  // Componente para para extraer viajes de SubaBase
  const loadTrips = async () => {
  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("taxi_requests")
    .select("id, destination, status, started_at, completed_at")
    .eq("user_id", user.id)
    .eq("status", "completado")
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Error al cargar el historial:", error);
    return;
  }

  setTrips(data ?? []);
  };

  const calculateDuration = (
  startedAt: string | null,
  completedAt: string | null
) => {
  if (!startedAt || !completedAt) {
    return "No disponible";
  }

  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();

  const durationMinutes = Math.round(
    (end - start) / (1000 * 60)
  );

  if (durationMinutes < 1) {
    return "Menos de 1 minuto";
  }

  return `${durationMinutes} min`;
};

  useEffect(() => {
      loadTrips();
      }, [user]);
  
  // Componente que representa cada viaje del historial.
  const renderTrip = ({ item, index,}: {item: Trip; index: number;}) => (
    
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
        🚕 Viaje {index + 1}
      </Text>

      {/* Destino del viaje. */}
      <Text
        style={[
          styles.destination,
          { color: colors.textSecondary },
        ]}
      >
       📍 Destino: {item.destination}
      </Text>
      
      <Text
        style={[
          styles.status,
          { color: colors.textSecondary },
        ]}
      >
        🕐 Inicio:{" "}
        {item.started_at
          ? new Date(item.started_at).toLocaleTimeString([], {
             hour: "2-digit",
             minute: "2-digit",
            })
          : "No disponible"}
      </Text>

      <Text
        style={[
         styles.status,
         { color: colors.textSecondary },
       ]}
      >
        🏁 Fin:{" "}
        {item.completed_at
         ? new Date(item.completed_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "No disponible"}
      </Text>

      <Text
        style={[
         styles.status,
         { color: colors.textSecondary },
       ]}
      >
        ⏱️ Duración:{" "}
        {calculateDuration(item.started_at, item.completed_at)}
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