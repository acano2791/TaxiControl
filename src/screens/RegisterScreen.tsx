import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

export default function RegisterScreen() {
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

  // Función que se ejecuta al presionar el botón de registro.
  const handleRegister = () => {
    // Indica que el usuario intentó enviar el formulario.
    setSubmitted(true);

    // Verifica que todos los campos tengan información.
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      phone.trim() === ""
    ) {
      // Muestra un mensaje indicando que deben completarse los campos.
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
    if (password.length < 4) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 4 caracteres."
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
    Alert.alert(
      "Registro exitoso",
      "Los datos fueron validados correctamente."
    );

    // También mostramos los datos en la consola.
    console.log("Datos de registro:", {
      name,
      email,
      password,
      phone,
    });
  };

  return (
    // Ajusta la pantalla cuando aparece el teclado.
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Permite desplazar el formulario cuando el teclado ocupa espacio. */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Título principal de la pantalla. */}
          <Text style={styles.title}>Crear cuenta</Text>

          {/* Texto descriptivo del formulario. */}
          <Text style={styles.subtitle}>
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
  // Contenedor principal que se adapta a la aparición del teclado.
  keyboardContainer: {
    flex: 1,
  },

  // Permite que el contenido pueda desplazarse verticalmente.
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