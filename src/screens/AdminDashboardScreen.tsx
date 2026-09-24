import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";

type Trip = {
  id: string;
  destination: string;
  status: string;
  requested_at: string;
  completed_at: string | null;
};

export default function AdminDashboardScreen() {
  const { colors } = useTheme();

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [activeDrivers, setActiveDrivers] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [tripsInProgress, setTripsInProgress] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);

  const loadDashboardData = async () => {
    // Consulta la cantidad total de usuarios registrados.
    const { count: usersCount, error: usersError } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "usuario");

    if (usersError) {
      console.error("Error al cargar usuarios:", usersError);
    } else {
      setTotalUsers(usersCount ?? 0);
    }

    // Consulta la cantidad total de conductores registrados.
    const { count: driversCount, error: driversError } =
      await supabase
        .from("drivers")
        .select("id", { count: "exact", head: true });

    if (driversError) {
      console.error("Error al cargar conductores:", driversError);
    } else {
      setTotalDrivers(driversCount ?? 0);
    }

    // Consulta la cantidad de conductores actualmente disponibles.
    const { count: activeDriversCount, error: activeDriversError } =
      await supabase
        .from("drivers")
        .select("id", { count: "exact", head: true })
        .eq("is_available", true);

    if (activeDriversError) {
      console.error(
        "Error al cargar conductores activos:",
        activeDriversError
      );
    } else {
      setActiveDrivers(activeDriversCount ?? 0);
    }

    // Consulta todas las solicitudes para obtener los diferentes estados.
    const { data: requests, error: requestsError } =
      await supabase
        .from("taxi_requests")
        .select(
          "id, destination, status, requested_at, completed_at"
        )
        .order("requested_at", {
          ascending: false,
        });

    if (requestsError) {
      console.error(
        "Error al cargar solicitudes:",
        requestsError
      );
      return;
    }

    const allRequests = requests ?? [];

    // Guarda la cantidad total de solicitudes.
    setTotalRequests(allRequests.length);

    // Cuenta las solicitudes pendientes.
    setPendingRequests(
      allRequests.filter(
        (request) => request.status === "pendiente"
      ).length
    );

    // Cuenta los viajes que están actualmente en curso.
    setTripsInProgress(
      allRequests.filter(
        (request) => request.status === "en_curso"
      ).length
    );

    // Cuenta los viajes completados.
    setCompletedTrips(
      allRequests.filter(
        (request) => request.status === "completado"
      ).length
    );

    // Guarda los últimos cinco viajes realizados.
    const completed = allRequests
      .filter(
        (request) => request.status === "completado"
      )
      .slice(0, 5);

    setRecentTrips(completed);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Panel del Administrador
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Resumen general de TaxiControl
      </Text>

      {/* Estadísticas generales */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        📊 Resumen general
      </Text>

      {/* Usuarios y conductores */}
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
          <Text style={styles.statIcon}>👥</Text>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {totalUsers}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.textSecondary },
            ]}
          >
            Usuarios
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
          <Text style={styles.statIcon}>🚕</Text>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {totalDrivers}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.textSecondary },
            ]}
          >
            Conductores
          </Text>
        </View>
      </View>

      {/* Conductores activos */}
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
          <Text style={styles.statIcon}>🟢</Text>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {activeDrivers}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.textSecondary },
            ]}
          >
            Conductores activos
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
          <Text style={styles.statIcon}>📋</Text>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {totalRequests}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.textSecondary },
            ]}
          >
            Solicitudes
          </Text>
        </View>
      </View>

      {/* Solicitudes pendientes y viajes en curso */}
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
          <Text style={styles.statIcon}>🟡</Text>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {pendingRequests}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.textSecondary },
            ]}
          >
            Pendientes
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
          <Text style={styles.statIcon}>🚗</Text>

          <Text
            style={[
              styles.statNumber,
              { color: colors.text },
            ]}
          >
            {tripsInProgress}
          </Text>

          <Text
            style={[
              styles.statLabel,
              { color: colors.textSecondary },
            ]}
          >
            En curso
          </Text>
        </View>
      </View>

      {/* Viajes completados */}
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
            Completados
          </Text>
        </View>
      </View>

      {/* Últimos viajes */}
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        🕘 Últimos viajes
      </Text>

      {recentTrips.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            { color: colors.textSecondary },
          ]}
        >
          Aún no hay viajes completados.
        </Text>
      ) : (
        recentTrips.map((trip, index) => (
          <View
            key={trip.id}
            style={[
              styles.tripCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.tripTitle,
                { color: colors.text },
              ]}
            >
              🚕 Viaje {index + 1}
            </Text>

            <Text
              style={[
                styles.tripText,
                { color: colors.text },
              ]}
            >
              📍 Destino: {trip.destination}
            </Text>

            <Text
              style={[
                styles.tripText,
                { color: colors.textSecondary },
              ]}
            >
              🕐 Solicitud:{" "}
              {new Date(
                trip.requested_at
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <Text
              style={[
                styles.tripText,
                { color: colors.textSecondary },
              ]}
            >
              🏁 Estado: {trip.status}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },

  sectionTitle: {
    width: "100%",
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
    marginBottom: 12,
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

  emptyText: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 10,
  },

  tripCard: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },

  tripTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },

  tripText: {
    fontSize: 15,
    marginBottom: 6,
  },
});