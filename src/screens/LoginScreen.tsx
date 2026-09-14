import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View, } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { RootStackParamList } from "../navigation/StackNavigator";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

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

  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Función que se ejecuta al presionar el botón de iniciar sesión.
  const handleLogin = () => {
    // Por ahora registramos al usuario como usuario.
    login(email, "usuario");

    // Navegamos hacia las pestañas principales.
    navigation.navigate("UserTabs");
  };

  return (
    // Ajusta la pantalla cuando aparece el teclado.
    <KeyboardAvoidingView
      style={[
        styles.keyboardContainer,
        { backgroundColor: colors.background },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Permite desplazar el contenido cuando el teclado ocupa espacio. */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Logo local de TaxiControl. */}
          <Image
            source={require("../../assets/taxicontrol-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Texto descriptivo de la pantalla. */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
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

          {/* Texto que indica que el usuario puede crear una cuenta. */}
          <Text style={[styles.registerText, { color: colors.textSecondary }]}>
            ¿No tienes una cuenta?
          </Text>

          {/* Botón que permite acceder al formulario de registro. */}
          <CustomButton
            title="Crear cuenta"
            variant="secondary"
            onPress={() => navigation.navigate("RegisterScreen")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos de la pantalla de inicio de sesión.
const styles = StyleSheet.create({
  // Contenedor que se adapta a la aparición del teclado.
  keyboardContainer: {
    flex: 1,
  },

  // Permite desplazar verticalmente el contenido.
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  // Contenedor visual de la pantalla.
  container: {
    alignItems: "center",
    padding: 24,
  },

  // Tamaño y separación del logo.
  logo: {
    width: 260,
    height: 260,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: "center",
  },

  registerText: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
});