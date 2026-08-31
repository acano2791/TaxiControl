import { Pressable, StyleSheet, Text } from "react-native";

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
  // Obtiene los estilos correspondientes a la variante seleccionada.
  const styles = getStyles(variant);

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      disabled={disabled}
    >
      {/* Texto que se muestra dentro del botón. */}
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

// Genera los estilos dependiendo de la variante del botón.
const getStyles = (
  variant: "primary" | "secondary" | "tertiary"
) =>
  StyleSheet.create({
    button: {
      backgroundColor:
        variant === "primary"
          ? "#0B2545"
          : variant === "secondary"
            ? "#C5D0DC"
            : "#EEF1F5",
      width: 180,
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",

      // El borde solamente se muestra en la variante tertiary.
      borderWidth: variant === "tertiary" ? 1 : 0,
      borderColor:
        variant === "tertiary" ? "#8A96A8" : "transparent",
    },

    buttonText: {
      // El botón principal utiliza texto claro y los demás texto oscuro.
      color: variant === "primary" ? "#FFFFFF" : "#1A2B3D",
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
    },
  });