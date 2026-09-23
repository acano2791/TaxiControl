import { StyleSheet, Text, View, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";

export default function DriverHomeScreen() {
  const { logout } = useAuth();
  const { colors } = useTheme();

  const handleSelectPhoto = async () => {
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

    console.log("FOTO SELECCIONADA:", selectedImage.uri);

    Alert.alert(
      "Foto seleccionada",
      "La imagen fue seleccionada correctamente."
    );
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
      <Text style={[styles.title, { color: colors.text }]}>
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