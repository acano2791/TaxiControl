import { StyleSheet, Text, View} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";

export default function HomeScreen() {
  // Obtiene los colores del tema actual.
  const { colors } = useTheme();
  // Obtiene la información del usuario que inició sesión.
  const { user } = useAuth();
  // Guarda la cantidad total de viajes solicitados por el usuario.
  const [totalTrips, setTotalTrips] = useState(0);
  // Guarda la cantidad de viajes que el usuario ha completado.
  const [completedTrips, setCompletedTrips] = useState(0);

  // Guarda los destinos más visitados por el usuario.
  const [topDestinations, setTopDestinations] = useState<
    { destination: string; count: number }[]
  >([]);

  // Consulta las solicitudes de taxi realizadas por el usuario.
  const loadDashboardData = async () => {
  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("taxi_requests")
    .select("id, status, destination")
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "Error al cargar los datos del dashboard:",
      error
    );
    return;
  }

  // Guarda la cantidad total de viajes solicitados.
  setTotalTrips(data?.length ?? 0);

  // Cuenta únicamente los viajes que fueron completados.
  const completed = (data ?? []).filter(
    (trip) => trip.status === "completado"
  ).length;

  setCompletedTrips(completed);

  // Cuenta cuántas veces aparece cada destino.
  const destinationCounts: {
    [key: string]: number;
  } = {};

  (data ?? []).forEach((trip) => {
    destinationCounts[trip.destination] =
      (destinationCounts[trip.destination] ?? 0) + 1;
  });

  // Convierte los destinos en una lista y los ordena
  // de mayor a menor cantidad de viajes.
  const destinations = Object.entries(destinationCounts)
    .map(([destination, count]) => ({
      destination,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  // Guarda los tres destinos más visitados.
  setTopDestinations(destinations);

  };
  // Carga los datos del dashboard cuando cambia el usuario autenticado.
  useEffect(() => {
    loadDashboardData();
  }, [user]);

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
      
      // Resumen de los viajes realizados por el usuario.
      <Text
        style={[
         styles.sectionTitle,
         { color: colors.text },
       ]}
      >
        📊 Resumen de viajes
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
      <View style={styles.statsContainer}>
        <View
          style={[
           styles.statCard,
            {
             backgroundColor: colors.cardBackground,
             borderColor: colors.cardBorder,
           },
          ]}
        >
         <Text style={styles.statIcon}>🚕</Text>

         <Text
            style={[
              styles.statNumber,
             { color: colors.text },
           ]}
         >
           {totalTrips}
         </Text>

         <Text
           style={[
             styles.statLabel,
             { color: colors.textSecondary },
           ]}
         >
           Viajes solicitados
         </Text>
       </View>

       <View
         style={[
           styles.statCard,
           {
           backgroundColor: colors.cardBackground,
           borderColor: colors.cardBorder,
           },
          ]}
        >
          <Text style={styles.statIcon}>✅</Text>

         <Text
           style={[
              styles.statNumber,
              { color: colors.text },
           ]}
         >
            {completedTrips}
         </Text>

          <Text
           style={[
             styles.statLabel,
             { color: colors.textSecondary },
           ]}
         >
           Viajes completados
          </Text>
        </View>
      </View>
      // Muestra los destinos más visitados por el usuario.
<View style={styles.topDestinationsContainer}>
  <Text
    style={[
      styles.sectionTitle,
      { color: colors.text },
    ]}
  >
    🏆 Destinos más visitados
  </Text>

  {topDestinations.length === 0 ? (
    <Text
      style={[
        styles.emptyText,
        { color: colors.textSecondary },
      ]}
    >
      Aún no hay destinos registrados.
    </Text>
  ) : (
    topDestinations.map((item, index) => (
      <View
        key={item.destination}
        style={[
          styles.destinationCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <Text style={styles.destinationPosition}>
          {index === 0
            ? "🥇"
            : index === 1
            ? "🥈"
            : "🥉"}
        </Text>

        <View style={styles.destinationInfo}>
          <Text
            style={[
              styles.destinationName,
              { color: colors.text },
            ]}
          >
            {item.destination}
          </Text>

          <Text
            style={[
              styles.destinationCount,
              { color: colors.textSecondary },
            ]}
          >
            {item.count}{" "}
            {item.count === 1 ? "viaje" : "viajes"}
          </Text>
        </View>
      </View>
    ))
  )}
</View>
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

    sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 15,
    textAlign: "center",
  },

  statsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },

  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
  },

  statLabel: {
    fontSize: 14,
    textAlign: "center",
  },

    topDestinationsContainer: {
    width: "100%",
    marginTop: 25,
  },

  emptyText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
  },

  destinationCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  destinationPosition: {
    fontSize: 28,
    marginRight: 12,
  },

  destinationInfo: {
    flex: 1,
  },

  destinationName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  destinationCount: {
    fontSize: 14,
  },
});