import { KeyboardTypeOptions, StyleSheet, Text, TextInput, TouchableOpacity, View,} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";

// Propiedades que puede recibir nuestro componente reutilizable.
type CustomInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: "default" | "password" | "number" | "email" | "phone";
  showRequiredError?: boolean;
};

// Componente reutilizable para los campos de texto de TaxiControl.
export default function CustomInput({
  placeholder,
  value,
  onChangeText,
  type = "default",
  showRequiredError = false,
}: CustomInputProps) {
  // Estado local que controla si la contraseña se muestra u oculta.
  const [isSecureText, setIsSecureText] = useState(type === "password");

  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Determina si el campo corresponde a una contraseña.
  const isPasswordField = type === "password";

  // Define el tipo de teclado dependiendo del tipo de campo.
  const keyboardType: KeyboardTypeOptions =
    type === "email"
      ? "email-address"
      : type === "number"
        ? "number-pad"
        : type === "phone"
          ? "phone-pad"
          : "default";

  // Función que controla los cambios realizados en el campo.
  const handleChangeText = (text: string) => {
    // En los campos de teléfono solamente se permiten números.
    if (type === "phone") {
      const onlyNumbers = text.replace(/\D/g, "");
      onChangeText(onlyNumbers);
      return;
    }

    // Para los demás tipos se conserva el texto ingresado.
    onChangeText(text);
  };

  // Función que realiza las validaciones básicas del campo.
  const getError = () => {
    // Valida que un campo obligatorio no quede vacío.
    if (value.trim() === "") {
      return "Este campo es obligatorio";
    }

    // Valida que el correo contenga el símbolo @.
    if (type === "email" && !value.includes("@")) {
      return "Correo inválido";
    }

    // Valida que la contraseña tenga al menos 4 caracteres.
    if (type === "password" && value.length < 4) {
      return "La contraseña es débil";
    }

    // Valida que un campo numérico tenga al menos dos caracteres.
    if (type === "number" && value.length < 2) {
      return "Número inválido";
    }

    // Valida que el teléfono tenga exactamente 8 dígitos.
    if (type === "phone" && value.length !== 8) {
      return "Teléfono inválido";
    }

    // Si no existe ningún error, no se muestra mensaje.
    return "";
  };

  // Guarda el mensaje de error correspondiente al campo.
  const error = getError();

  // Determina cuándo se debe mostrar el mensaje de error.
  const shouldShowError =
    error !== "" && (value !== "" || showRequiredError);

  return (
    <View style={styles.wrapper}>
      {/* Contenedor visual del campo de entrada. */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: shouldShowError
              ? "#D32F2F"
              : colors.border,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          secureTextEntry={isSecureText}
          maxLength={type === "phone" ? 8 : undefined}
        />

        {/* El botón del ojo solamente aparece en campos de contraseñas. */}
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setIsSecureText(!isSecureText)}
          >
            <Ionicons
              name={isSecureText ? "eye" : "eye-off"}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Muestra el mensaje de error cuando corresponde. */}
      {shouldShowError && (
        <Text style={styles.error}>{error}</Text>
      )}
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
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 14,
    paddingVertical: 4,
    minHeight: 50,
  },

  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },

  error: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
});