import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View,} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { RootStackParamList } from "../navigation/StackNavigator";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

// Tipado de las propiedades de navegación de la pantalla de registro.
type Props = NativeStackScreenProps<
  RootStackParamList,
  "RegisterScreen"
>;

// Pantalla de registro de TaxiControl.
export default function RegisterScreen({ navigation }: Props) {  
  const { register } = useAuth();

  // Estado que almacena el nombre ingresado por el usuario.
  const [name, setName] = useState("");

  // Estado que almacena el correo electrónico.
  const [email, setEmail] = useState("");

  // Estado que almacena la contraseña.
  const [password, setPassword] = useState("");

  // Estado que almacena el número de teléfono.
  const [phone, setPhone] = useState("");

  // Estado que indica si el usuario intentó enviar el formulario.
  const [submitted, setSubmitted] = useState(false);

  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Función que se ejecuta al presionar el botón de registro.
  const handleRegister = async () => {
    // Indica que el usuario intentó enviar el formulario.
    setSubmitted(true);

    // Verifica que todos los campos tengan información.
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      phone.trim() === ""
    ) {
      Alert.alert(
        "Formulario incompleto",
        "Completa todos los campos para continuar."
      );
      return;
    }

    // Valida que el correo tenga un formato básico.
    if (!email.includes("@")) {
      Alert.alert(
        "Correo inválido",
        "Ingresa un correo electrónico válido."
      );
      return;
    }

    // Valida que la contraseña tenga al menos 4 caracteres.
    if (password.length < 6) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    // Valida que el teléfono tenga 8 dígitos.
    if (phone.length !== 8) {
      Alert.alert(
        "Teléfono inválido",
        "El teléfono debe tener 8 dígitos."
      );
      return;
    }

    // Muestra un mensaje cuando todos los datos son válidos.
        try {
      // Registra el usuario mediante Supabase Auth.
      await register(email, password);

      console.log("Usuario registrado en Supabase:", {
        email,
      });

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta fue creada correctamente.",
        [
          {
            text: "OK",
            onPress: () => {
              // Limpia todos los campos del formulario.
              setName("");
              setEmail("");
              setPassword("");
              setPhone("");

              // Reinicia el estado de validación.
              setSubmitted(false);

              // Regresa a la pantalla de Login.
              navigation.navigate("LoginScreen");
            },
          },
        ]
      );
    } catch (error: any) {
      console.log("Error al registrar usuario:", error);

      Alert.alert(
        "Error de registro",
        error?.message ?? "No fue posible crear la cuenta."
      );
    }
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
      {/* Permite desplazar el formulario cuando el teclado ocupa espacio. */}
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
          {/* Título principal de la pantalla. */}
          <Text style={[styles.title, { color: colors.text }]}>
            Crear cuenta
          </Text>

          {/* Texto descriptivo del formulario. */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Completa tus datos para registrarte
          </Text>

          {/* Campo reutilizable para ingresar el nombre. */}
          <CustomInput
            type="default"
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            showRequiredError={submitted}
          />

          {/* Campo reutilizable para ingresar el correo. */}
          <CustomInput
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            showRequiredError={submitted}
          />

          {/* Campo reutilizable para ingresar la contraseña. */}
          <CustomInput
            type="password"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            showRequiredError={submitted}
          />

          {/* Campo reutilizable para ingresar el teléfono. */}
          <CustomInput
            type="phone"
            placeholder="Número de teléfono"
            value={phone}
            onChangeText={setPhone}
            showRequiredError={submitted}
          />

          {/* Botón que ejecuta el proceso de registro. */}
          <CustomButton
            title="Registrarme"
            onPress={handleRegister}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Estilos utilizados en la pantalla de registro.
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

  // Contenedor visual del formulario.
  container: {
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    marginBottom: 25,
    textAlign: "center",
  },
});