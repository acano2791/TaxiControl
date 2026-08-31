import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

// Pantalla para solicitar un taxi.
export default function RequestTaxiScreen() {
  // Estado que almacena la dirección de destino ingresada por el usuario.
  const [destination, setDestination] = useState("");

  // Estado que indica si existe una solicitud activa.
  const [requestSent, setRequestSent] = useState(false);

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
    <View style={styles.container}>
      {/* Título de la pantalla para solicitar un taxi. */}
      <Text style={styles.title}>Solicitar taxi</Text>

      {/* Descripción de la función principal de esta pantalla. */}
      <Text style={styles.subtitle}>
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
        <View style={styles.statusContainer}>
          {/* Título del estado de la solicitud. */}
          <Text style={styles.statusTitle}>Solicitud enviada</Text>

          {/* Mensaje que simula la búsqueda de un conductor. */}
          <Text style={styles.statusText}>
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