import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Alert } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

// Pantalla para solicitar un taxi.
export default function RequestTaxiScreen() {
  const { user } = useAuth();
  
  // Estado que almacena la dirección de destino ingresada por el usuario.
  const [destination, setDestination] = useState("");
  const [requestedDestination, setRequestedDestination] = useState("");

  // Estado que almacena el ID de la solicitud activa.
  const [requestId, setRequestId] = useState<string | null>(null);

  // Estado que almacena el estado actual de la solicitud.
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  // Estado que almacena la información del conductor asignado.
  const [assignedDriver, setAssignedDriver] = useState<any | null>(null);

  // Estado que almacena la URL temporal de la foto del conductor.
  const [driverPhotoUrl, setDriverPhotoUrl] = useState<string | null>(null);

  // Estado que indica si existe una solicitud activa.
  const [requestSent, setRequestSent] = useState(false);

  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Función que se ejecuta al presionar el botón para solicitar taxi.
  const handleRequestTaxi = async () => {
  if (!user) {
    return;
  }

  if (!destination.trim()) {
        return;
  }
    const { data: activeRequest, error: activeRequestError } = await supabase
    .from("taxi_requests")
    .select("id, status")
    .eq("user_id", user.id)
    .in("status", ["pendiente", "asignado", "en_curso"])
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeRequestError) {
    console.error(
      "Error al consultar solicitudes activas:",
      activeRequestError
    );
    return;
  }

  if (activeRequest) {
    Alert.alert(
    "Solicitud activa",
    "Ya tienes una solicitud de taxi activa. Debes esperar a que finalice antes de solicitar otro taxi."
  );
    return;
  }

  const { data, error } = await supabase
    .from("taxi_requests")
    .insert({
      user_id: user.id,
      pickup_location: "Ubicación actual",
      destination: destination.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear solicitud:", error);
    return;
  }

  setRequestId(data.id);
  setRequestedDestination(destination.trim());
  setRequestSent(true);
  setDestination("");
  };

  const loadActiveRequest = async () => {
  if (!user) return;

  const { data, error } = await supabase
    .from("taxi_requests")
    .select("id, destination, status")
    .eq("user_id", user.id)
    .in("status", ["pendiente", "asignado", "en_curso"])
    .order("requested_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error al recuperar la solicitud activa:", error);
    return;
  }

  if (!data) {
    return;
  }

  setRequestId(data.id);
  setRequestedDestination(data.destination);
  setRequestStatus(data.status);
  setRequestSent(true);
};

  useEffect(() => {
  loadActiveRequest();
}, [user]);

  const loadRequestStatus = async () => {
  if (!requestId) return;

  const { data, error } = await supabase
    .from("taxi_requests")
    .select("status, driver_id")
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error al consultar el estado:", error);
    return;
  }

  setRequestStatus(data.status);

  if (data.driver_id) {
  const { data: driverData, error: driverError } = await supabase
  .rpc("get_assigned_driver_info_with_name", {
    p_driver_id: data.driver_id,
    });

  if (driverError) {
    console.error("Error al consultar el conductor:", driverError);
    return;
  }

  setAssignedDriver(driverData);
  const driverPhotoPath = driverData[0]?.photo_driver_url;
  
if (driverPhotoPath) {
  const { data: signedUrlData, error: signedUrlError } =
    await supabase.storage
      .from("driver-photos")
      .createSignedUrl(driverPhotoPath, 3600);

  if (signedUrlError) {
    console.error(
      "Error al generar la URL de la foto del conductor:",
      signedUrlError
    );
  } else {
    setDriverPhotoUrl(signedUrlData.signedUrl);
    }
  }}
  else {
    setAssignedDriver(null);
    setDriverPhotoUrl(null);
    }
  };

  useEffect(() => {
  if (!requestId) return;

  loadRequestStatus();

  const interval = setInterval(() => {
  loadRequestStatus();
}, 5000);

  return () => clearInterval(interval);
}, [requestId]);

  return (
  <ScrollView
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    contentContainerStyle={[
      styles.container,
      { backgroundColor: colors.background },
    ]}
  >

      {/* Título de la pantalla para solicitar un taxi. */}
      <Text style={[styles.title, { color: colors.text }]}>
        🚕 Solicitar taxi
      </Text>

      {/* Descripción de la función principal de esta pantalla. */}
      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Ingresa tu destino para solicitar un taxi cercano
      </Text>
      
            {/* Campo reutilizable para ingresar el destino. */}
      <CustomInput
        type="default"
        placeholder="Dirección de destino"
        value={destination}
        onChangeText={setDestination}
      />

      {/* Botón que permite enviar la solicitud de taxi. */}
      <CustomButton
        title="Solicitar taxi"
        onPress={handleRequestTaxi}
      />

      {/* Muestra el estado actual de la solicitud. */}
      {requestSent && (
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Título del estado de la solicitud. */}
          <Text
            style={[
              styles.statusTitle,
              { color: colors.text },
            ]}
          >
            📋 Solicitud enviada
          </Text>

          {/* Mensaje que muestra el estado de la solicitud. */}
          <Text
            style={[
              styles.statusText,
              { color: colors.textSecondary },
            ]}
          >
            📍 Destino: {requestedDestination}
          </Text>
    
          {/* Mensaje que muestra el estado de la solicitud. */}
          <Text
            style={[
              styles.statusText,
              { color: colors.textSecondary },
            ]}
            >
            🔄 Estado: {requestStatus ?? "pendiente"}
          </Text>

          {assignedDriver && (
  <>
    <Text
      style={[
        styles.statusTitle,
        { color: colors.text },
      ]}
    >
      👨‍✈️ Conductor asignado
        </Text>
    
        {driverPhotoUrl && (
  <Image
    source={{ uri: driverPhotoUrl }}
    style={styles.driverPhoto}
  />
)}

    <Text
      style={[
         styles.statusText,
         { color: colors.textSecondary },
       ]}
      >
        👨‍✈️ Nombre: {assignedDriver[0]?.driver_name}
    </Text>

    <Text
      style={[
        styles.statusText,
        { color: colors.textSecondary },
      ]}
    >
      🚗 Vehículo: {assignedDriver[0]?.vehicle_marca}{" "}
                    {assignedDriver[0]?.vehicle_model}
    </Text>
    
    <Text
      style={[
        styles.statusText,
        { color: colors.textSecondary },
      ]}
    >
      🎨 Color: {assignedDriver[0]?.vehicle_color}
    </Text>

    <Text
      style={[
        styles.statusText,
        { color: colors.textSecondary },
      ]}
    >
      🪪 Placa: {assignedDriver[0]?.vehicle_plate}
    </Text>

    
  </>
)}
        </View>
      )}
      
     </ScrollView>
  );
}

// Estilos utilizados en la pantalla de solicitud de taxi.
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
    marginBottom: 25,
  },

  servicesContainer: {
    width: "100%",
    marginBottom: 20,
  },

  servicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  
  statusContainer: {
    marginTop: 30,
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 12,
  },

  statusText: {
    fontSize: 15,
    textAlign: "center",
  },

  driverPhoto: {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 15,
  },
});