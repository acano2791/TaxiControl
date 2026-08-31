import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Título de la pantalla de perfil. */}
      <Text style={styles.title}>Mi perfil</Text>

      {/* Información que posteriormente reemplazaremos por los datos del usuario. */}
      <Text style={styles.subtitle}>
        Información del usuario
      </Text>
    </View>
  );
}

// Estilos de la pantalla de perfil.
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
  },
});