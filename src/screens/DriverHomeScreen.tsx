import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Alert,ScrollView,Switch,} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";
import { supabase } from "../lib/supabase";

export default function DriverHomeScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [assignedRequests, setAssignedRequests] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);

  const loadDriverPhoto = async () => {
    if (!user) {
      return;
    }

    const { data, error } = await supabase
      .from("drivers")
      .select("photo_driver_url")
      .eq("profile_id", user.id)
      .single();

    if (error) {
      console.error(
        "Error al cargar la foto del conductor:",
        error
      );
      return;
    }

    if (!data?.photo_driver_url) {
      setPhotoPath(null);
      setPhotoUrl(null);
      return;
    }

    setPhotoPath(data.photo_driver_url);

    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage
        .from("driver-photos")
        .createSignedUrl(data.photo_driver_url, 3600);

    if (signedUrlError) {
      console.error(
        "Error al generar URL de la foto:",
        signedUrlError
      );
      return;
    }

    setPhotoUrl(signedUrlData.signedUrl);
  };
  
  const loadDriverAvailability = async () => {
  if (!user) {
    return;
  }

  const { data, error } = await supabase
    .from("drivers")
    .select("is_available")
    .eq("profile_id", user.id)
    .single();

  if (error) {
    console.error(
      "Error al cargar la disponibilidad del conductor:",
      error
    );
    return;
  }

  setIsAvailable(data?.is_available ?? false);
};

  const handleAvailabilityChange = async (value: boolean) => {
  if (!user) {
    return;
  }

  const { error } = await supabase
    .from("drivers")
    .update({
      is_available: value,
    })
    .eq("profile_id", user.id);

  if (error) {
    console.error(
      "Error al actualizar la disponibilidad del conductor:",
      error
    );

    Alert.alert(
      "Error",
      "No se pudo actualizar tu disponibilidad."
    );

    return;
  }

  setIsAvailable(value);
};

  const loadAssignedRequests = async () => {
  if (!user) {
    return;
  }

  const { data: driverData, error: driverError } =
    await supabase
      .from("drivers")
      .select("id")
      .eq("profile_id", user.id)
      .single();

  if (driverError) {
    console.error(
      "Error al cargar los datos del conductor:",
      driverError
    );
    return;
  }

  const { data, error } = await supabase
    .from("taxi_requests")
    .select(
      "id, pickup_location, destination, status, requested_at, assigned_at"
    )
    .eq("driver_id", driverData.id)
    .in("status", ["asignado", "en_curso"])
    .order("assigned_at", { ascending: false });

  if (error) {
    console.error(
      "Error al cargar viajes asignados:",
      error
    );
    return;
  }

  setAssignedRequests(data ?? []);
  };

  const handleStartTrip = async (requestId: string) => {
  const { error } = await supabase
    .from("taxi_requests")
    .update({
      status: "en_curso",
      started_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "asignado");

  if (error) {
    console.error("Error al iniciar el viaje:", error);
    Alert.alert("Error", "No se pudo iniciar el viaje.");
    return;
  }

  Alert.alert("Viaje iniciado", "El viaje está ahora en curso.");
  await loadAssignedRequests();
};

  const handleCompleteTrip = async (requestId: string) => {
  const { error } = await supabase
    .from("taxi_requests")
    .update({
      status: "completado",
      completed_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "en_curso");

  if (error) {
    console.error("Error al completar el viaje:", error);
    Alert.alert("Error", "No se pudo completar el viaje.");
    return;
  }

  Alert.alert("Viaje completado", "El viaje se completó correctamente.");
  await loadAssignedRequests();
  };
  
  useEffect(() => {
  loadDriverPhoto();
  loadAssignedRequests();
  loadDriverAvailability();
}, [user]);

  const handleSelectPhoto = async () => {
    if (!user) {
      Alert.alert(
        "Error",
        "No se encontró el usuario autenticado."
      );
      return;
    }

    if (photoPath) {
      Alert.alert(
        "Foto ya registrada",
        "La foto del conductor ya fue registrada y no puede cambiarse."
      );
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permiso requerido",
        "Necesitamos permiso para acceder a tus fotos."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) {
      return;
    }

    const selectedImage = result.assets[0];

    console.log(
      "FOTO SELECCIONADA:",
      selectedImage.uri
    );

    try {
      const response = await fetch(selectedImage.uri);
      const arrayBuffer = await response.arrayBuffer();

      const filePath = `${user.id}/profile.jpg`;

      const { error: uploadError } =
        await supabase.storage
          .from("driver-photos")
          .upload(filePath, arrayBuffer, {
            contentType:
              selectedImage.mimeType ?? "image/jpeg",
            upsert: false,
          });

      if (uploadError) {
        console.error(
          "Error al subir la foto:",
          uploadError
        );

        Alert.alert(
          "Error",
          "No se pudo subir la foto."
        );

        return;
      }

      console.log(
        "FOTO SUBIDA CORRECTAMENTE:",
        filePath
      );

      const { error: updateError } =
        await supabase
          .from("drivers")
          .update({
            photo_driver_url: filePath,
          })
          .eq("profile_id", user.id);

      if (updateError) {
        console.error(
          "Error al guardar la ruta de la foto:",
          updateError
        );

        Alert.alert(
          "Error",
          "La foto se subió, pero no se pudo guardar la información del conductor."
        );

        return;
      }

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("driver-photos")
          .createSignedUrl(filePath, 3600);

      if (signedUrlError) {
        console.error(
          "Error al generar URL de la foto:",
          signedUrlError
        );
      } else {
        setPhotoPath(filePath);
        setPhotoUrl(signedUrlData.signedUrl);
      }

      Alert.alert(
        "Foto guardada",
        "Tu foto de conductor se guardó correctamente."
      );
    } catch (error) {
      console.error(
        "Error inesperado al subir la foto:",
        error
      );

      Alert.alert(
        "Error",
        "Ocurrió un error al subir la foto."
      );
    }
  };

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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        Panel del Conductor
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Bienvenido a TaxiControl
      </Text>

      <View style={styles.availabilityContainer}>
  <Text
    style={[
      styles.availabilityTitle,
      { color: colors.text },
    ]}
  >
    {isAvailable
      ? "🟢 Conductor disponible"
      : "🔴 Conductor no disponible"}
  </Text>

  <Switch
    value={isAvailable}
    onValueChange={handleAvailabilityChange}
    thumbColor={isAvailable ? colors.primary : "#f4f3f4"}
    trackColor={{
      false: "#ccc",
      true: colors.primary,
    }}
  />
</View>

      <View style={styles.photoContainer}>
        <Text
          style={[
            styles.photoTitle,
            { color: colors.text },
          ]}
        >
          Foto del conductor
        </Text>

        {photoUrl ? (
          <>
            <Image
              source={{ uri: photoUrl }}
              style={styles.driverPhoto}
            />

            <Text
              style={[
                styles.photoRegisteredText,
                { color: colors.textSecondary },
              ]}
            >
              Foto registrada
            </Text>
          </>
        ) : (
          <CustomButton
            title="Seleccionar foto"
            onPress={handleSelectPhoto}
          />
        )}
      </View>

      <View style={styles.requestsContainer}>
  <Text
    style={[
      styles.sectionTitle,
      { color: colors.text },
    ]}
  >
    Viajes asignados
  </Text>

  {assignedRequests.length === 0 ? (
    <Text
      style={[
        styles.emptyText,
        { color: colors.textSecondary },
      ]}
    >
      No tienes viajes asignados.
    </Text>
  ) : (
    assignedRequests.map((request) => (
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
            styles.requestText,
            { color: colors.text },
          ]}
        >
          Estado: {request.status}
        </Text>

        {request.status === "asignado" && (
  <View style={styles.tripButtonContainer}>
    <CustomButton
      title="Iniciar viaje"
      onPress={() => handleStartTrip(request.id)}
    />
  </View>
)}
      {request.status === "en_curso" && (
  <View style={styles.tripButtonContainer}>
    <CustomButton
      title="Completar viaje"
      onPress={() => handleCompleteTrip(request.id)}
    />
  </View>
)}
      </View>
    ))
  )}
</View>

      <View style={styles.buttonContainer}>
  <CustomButton
    title="👤 Mi perfil"
    onPress={() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("ProfileScreen");
      }
    }}
  />

  <CustomButton
    title="Cerrar sesión"
    variant="secondary"
    onPress={handleLogout}
  />
</View>
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
  },

  subtitle: {
    fontSize: 16,
  },

  availabilityContainer: {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: 20,
  padding: 15,
  borderRadius: 10,
  },

  availabilityTitle: {
  fontSize: 16,
  fontWeight: "bold",
  },

  photoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },

  photoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  driverPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 12,
  },

  photoRegisteredText: {
    fontSize: 14,
  },

  buttonContainer: {
    marginTop: 35,
  },

  requestsContainer: {
  width: "100%",
  marginTop: 30,
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

tripButtonContainer: {
  marginTop: 10,
},

});