import { StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import CustomButton from "../components/CustomButton";
import { navigationRef } from "../navigation/NavigationService";

export default function DriverHomeScreen() {
  const { logout } = useAuth();
  const { colors } = useTheme();

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

      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Bienvenido a TaxiControl
      </Text>

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

  buttonContainer: {
    marginTop: 35,
  },
});