import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useTheme } from "../contexts/ThemeContext";

// Pantalla para solicitar un taxi.
export default function RequestTaxiScreen() {
  // Estado que almacena la dirección de destino ingresada por el usuario.
  const [destination, setDestination] = useState("");

  // Estado que indica si existe una solicitud activa.
  const [requestSent, setRequestSent] = useState(false);

  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Función que se ejecuta al presionar el botón para solicitar taxi.
  const handleRequestTaxi = () => {
    // Cambia el estado para indicar que la solicitud fue enviada.
    setRequestSent(true);

    // Muestra los datos de la solicitud en la consola.
    console.log("Solicitud de taxi:", {
      destination,
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Título de la pantalla para solicitar un taxi. */}
      <Text style={[styles.title, { color: colors.text }]}>
        Solicitar taxi
      </Text>

      {/* Descripción de la función principal de esta pantalla. */}
      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary },
        ]}
      >
        Ingresa tu destino para solicitar un taxi cercano
      </Text>

      {/* Campo reutilizable para ingresar el destino. */}
      <CustomInput
        type="default"
        placeholder="Dirección de destino"
        value={destination}
        onChangeText={setDestination}
      />

      {/* Botón que permite enviar la solicitud de taxi. */}
      <CustomButton
        title="Solicitar taxi"
        onPress={handleRequestTaxi}
      />

      {/* Muestra el estado actual de la solicitud. */}
      {requestSent && (
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          {/* Título del estado de la solicitud. */}
          <Text
            style={[
              styles.statusTitle,
              { color: colors.text },
            ]}
          >
            Solicitud enviada
          </Text>

          {/* Mensaje que simula la búsqueda de un conductor. */}
          <Text
            style={[
              styles.statusText,
              { color: colors.textSecondary },
            ]}
          >
            Buscando conductor cercano...
          </Text>
        </View>
      )}
    </View>
  );
}

// Estilos utilizados en la pantalla de solicitud de taxi.
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
    marginBottom: 25,
  },

  statusContainer: {
    marginTop: 30,
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderRadius: 10,
    width: "100%",
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  statusText: {
    fontSize: 15,
    textAlign: "center",
  },
});