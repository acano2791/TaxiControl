import { StyleSheet, Text, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";
import { supabase } from "../lib/supabase";

export default function DriverHomeScreen() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const handleSelectPhoto = async () => {
    if (!user) {
      Alert.alert(
        "Error",
        "No se encontró el usuario autenticado."
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
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
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

      <View style={styles.photoContainer}>
        <Text
          style={[
            styles.photoTitle,
            { color: colors.text },
          ]}
        >
          Foto del conductor
        </Text>

        <CustomButton
          title="Seleccionar foto"
          onPress={handleSelectPhoto}
        />
      </View>

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

  buttonContainer: {
    marginTop: 35,
  },
});