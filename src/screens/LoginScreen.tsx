import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { RootStackParamList } from "../navigation/StackNavigator";
import { useAuth } from "../contexts/AuthContext";

// Tipado de las propiedades de navegación de la pantalla Login.
type Props = NativeStackScreenProps<
  RootStackParamList,
  "LoginScreen"
>;

// Pantalla de inicio de sesión de TaxiControl.
export default function LoginScreen({ navigation }: Props) {
  // Estado que almacena el correo ingresado por el usuario.
  const [email, setEmail] = useState("");

  // Estado que almacena la contraseña ingresada por el usuario.
  const [password, setPassword] = useState("");

  // Obtiene la función login del contexto de autenticación.
  const { login } = useAuth();

  // Función que se ejecuta al presionar el botón de iniciar sesión.
  const handleLogin = () => {
    // Por ahora registramos al usuario como usuario.
    login(email, "usuario");

    // Navegamos hacia las pestañas principales.
    navigation.navigate("UserTabs");
  };

  return (
    <View style={styles.container}>
      {/* Título principal de la aplicación. */}
      <Text style={styles.title}>TaxiControl</Text>

      {/* Texto descriptivo de la pantalla. */}
      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>

      {/* Campo reutilizable para ingresar el correo electrónico. */}
      <CustomInput
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo reutilizable para ingresar la contraseña. */}
      <CustomInput
        type="password"
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
      />

      {/* Botón que permite iniciar sesión. */}
      <CustomButton
        title="Iniciar sesión"
        onPress={handleLogin}
      />
    </View>
  );
}

// Estilos de la pantalla de inicio de sesión.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 25,
  },
});