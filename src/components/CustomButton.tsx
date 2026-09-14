import { Pressable, StyleSheet, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

// Propiedades que puede recibir nuestro botón reutilizable.
type CustomButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
};

// Componente reutilizable para los botones de TaxiControl.
export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: CustomButtonProps) {
  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Define los colores según la variante y el tema.
  const buttonBackground =
    variant === "primary"
      ? colors.primary
      : colors.surface;

  const buttonTextColor =
    variant === "primary"
      ? "#FFFFFF"
      : colors.text;

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: buttonBackground,
          borderWidth: variant === "tertiary" ? 1 : 0,
          borderColor:
            variant === "tertiary"
              ? colors.border
              : "transparent",
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Texto que se muestra dentro del botón. */}
      <Text
        style={[
          styles.buttonText,
          { color: buttonTextColor },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// Estilos generales del botón.
const styles = StyleSheet.create({
  button: {
    width: 180,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});