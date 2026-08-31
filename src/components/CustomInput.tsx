import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

// Propiedades que puede recibir nuestro componente reutilizable.
type CustomInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "default" | "password" | "number" | "email";
};

// Componente reutilizable para los campos de texto de TaxiControl.
export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  type = "default",
}: CustomInputProps) {
  // Estado local que controla si la contraseña se muestra u oculta.
  const [isSecureText, setIsSecureText] = useState(type === "password");

  // Determina si el campo corresponde a una contraseña.
  const isPasswordField = type === "password";

  // Define el tipo de teclado dependiendo del tipo de campo.
  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "number-pad"
        : "default";

  // Función que realiza las validaciones básicas del campo.
  const getError = () => {
    // Valida que el correo contenga el símbolo @.
    if (type === "email" && value !== "" && !value.includes("@")) {
      return "Correo inválido";
    }

    // Valida que la contraseña tenga al menos 4 caracteres.
    if (type === "password" && value !== "" && value.length < 4) {
      return "La contraseña es débil";
    }

    // Valida que un campo numérico tenga al menos dos caracteres.
    if (type === "number" && value !== "" && value.length < 2) {
      return "Número inválido";
    }

    // Si no existe ningún error, no se muestra mensaje.
    return "";
  };

  // Guarda el mensaje de error correspondiente al campo.
  const error = getError();

  return (
    <View style={styles.wrapper}>
      {/* Contenedor visual del campo de entrada. */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
        />

        {/* El botón del ojo solamente aparece en campos de contraseña. */}
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsSecureText(!isSecureText)}
          >
            <Ionicons
              name={isSecureText ? "eye" : "eye-off"}
              size={22}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Muestra el mensaje de error cuando existe. */}
      {error !== "" && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

// Estilos utilizados por el componente.
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
    width: "85%",
    alignSelf: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F4F6F8",
    borderColor: "#9AA8B8",
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 14,
    paddingVertical: 4,
    minHeight: 50,
  },

  input: {
    flex: 1,
    color: "#1A2B3D",
    fontSize: 15,
    paddingVertical: 10,
  },

  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
});