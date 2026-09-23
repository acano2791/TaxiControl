import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";
import { supabase } from "../lib/supabase";

export default function AdminHomeScreen() {
  const { logout } = useAuth();
  const { colors } = useTheme();

  const [requests, setRequests] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  // Carga las solicitudes de taxi pendientes.
  const loadRequests = async () => {
    const { data, error } = await supabase
      .from("taxi_requests")
      .select(
        "id, user_id, driver_id, pickup_location, destination, status, requested_at"
      )
      .eq("status", "pendiente")
      .order("requested_at", { ascending: false });

    if (error) {
      console.error("Error al cargar solicitudes:", error);

      Alert.alert(
        "Error",
        "No se pudieron cargar las solicitudes."
      );

      return;
    }

    setRequests(data ?? []);
  };

  // Carga los conductores disponibles.
  const loadDrivers = async () => {
  const { data: driversData, error: driversError } = await supabase
    .from("drivers")
    .select(
      "id, profile_id, license_number, license_type, license_expire, vehicle_marca, vehicle_model, vehicle_color, vehicle_plate, photo_driver_url, is_available"
    )
    .eq("is_available", true);

  if (driversError) {
    console.error("Error al cargar conductores:", driversError);

    Alert.alert(
      "Error",
      "No se pudieron cargar los conductores disponibles."
    );

    return;
  }

  const profileIds = (driversData ?? []).map(
    (driver) => driver.profile_id
  );

  if (profileIds.length === 0) {
    setDrivers([]);
    return;
  }

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, name, email, phone")
    .in("id", profileIds);

    console.log("PERFILES:", JSON.stringify(profilesData, null, 2));
console.log("ERROR PERFILES:", profilesError);

  if (profilesError) {
    console.error("Error al cargar perfiles:", profilesError);

    Alert.alert(
      "Error",
      "No se pudo cargar la información de los conductores."
    );

    return;
  }

  const driversWithProfiles = (driversData ?? []).map(
    (driver) => {
      const profile = (profilesData ?? []).find(
        (profile) => profile.id === driver.profile_id
      );

      return {
        ...driver,
        profile,
      };
    }
  );

  console.log(
    "CONDUCTORES COMPLETOS:",
    JSON.stringify(driversWithProfiles, null, 2)
  );

  setDrivers(driversWithProfiles);
};

  // Carga las solicitudes y conductores al abrir el panel.
  useEffect(() => {
    loadRequests();
    loadDrivers();
  }, []);

  // Cierra la sesión del administrador.
  const handleLogout = async () => {
    await logout();

    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      });
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Panel del Administrador
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Bienvenido a TaxiControl
      </Text>

      {/* Solicitudes pendientes */}
      <View style={styles.requestsContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Solicitudes pendientes
        </Text>

        {requests.length === 0 ? (
          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary },
            ]}
          >
            No hay solicitudes pendientes.
          </Text>
        ) : (
          requests.map((request) => (
            <View
              key={request.id}
              style={[
                styles.requestCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.requestText,
                  { color: colors.text },
                ]}
              >
                Origen: {request.pickup_location}
              </Text>

              <Text
                style={[
                  styles.requestText,
                  { color: colors.text },
                ]}
              >
                Destino: {request.destination}
              </Text>

              <Text
                style={[
                  styles.statusText,
                  { color: colors.textSecondary },
                ]}
              >
                Estado: {request.status}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Conductores disponibles */}
      <View style={styles.driversContainer}>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text },
          ]}
        >
          Conductores disponibles
        </Text>

        {drivers.length === 0 ? (
          <Text
            style={[
              styles.emptyText,
              { color: colors.textSecondary },
            ]}
          >
            No hay conductores disponibles.
          </Text>
        ) : (
          drivers.map((driver) => (
  <View
    key={driver.id}
    style={[
      styles.requestCard,
      {
        backgroundColor: colors.cardBackground,
        borderColor: colors.cardBorder,
      },
    ]}
  >
    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Nombre: {driver.profile?.name}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Correo: {driver.profile?.email}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Teléfono: {driver.profile?.phone}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Número de licencia: {driver.license_number}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Tipo de licencia: {driver.license_type}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Vencimiento de licencia: {driver.license_expire}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Vehículo: {driver.vehicle_marca}{" "}
      {driver.vehicle_model}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Color: {driver.vehicle_color}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Placa: {driver.vehicle_plate}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Disponibilidad:{" "}
      {driver.is_available
        ? "Disponible"
        : "No disponible"}
    </Text>

    <Text
      style={[
        styles.requestText,
        { color: colors.text },
      ]}
    >
      Foto:{" "}
      {driver.photo_driver_url
        ? "Registrada"
        : "No registrada"}
    </Text>
  </View>
))
          
        )}
      </View>

      {/* Botón de cerrar sesión */}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Cerrar sesión"
          variant="secondary"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
  },

  requestsContainer: {
    width: "100%",
    marginTop: 30,
  },

  driversContainer: {
    width: "100%",
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 15,
  },

  requestCard: {
    width: "100%",
    padding: 16,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
  },

  requestText: {
    fontSize: 15,
    marginBottom: 6,
  },

  statusText: {
    fontSize: 14,
    marginTop: 4,
  },

  buttonContainer: {
    marginTop: 35,
  },
});