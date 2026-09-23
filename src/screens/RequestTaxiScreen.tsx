import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useTheme } from "../contexts/ThemeContext";
import type { RootState, AppDispatch } from "../store";
import { addProduct } from "../store/slices/productsSlice";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

// Pantalla para solicitar un taxi.
export default function RequestTaxiScreen() {
  const { user } = useAuth();
  
  // Estado que almacena la dirección de destino ingresada por el usuario.
  const [destination, setDestination] = useState("");
  const [requestedDestination, setRequestedDestination] = useState("");

  // Estado que almacena el ID de la solicitud activa.
  const [requestId, setRequestId] = useState<string | null>(null);

  //
  const [requestStatus, setRequestStatus] = useState<string | null>(null);

  // Estado que indica si existe una solicitud activa.
  const [requestSent, setRequestSent] = useState(false);

  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  // Redux: obtiene el inventario de servicios disponibles.
  const inventory = useSelector(
  (state: RootState) => state.products.inventory
  );

  // Redux: obtiene los servicios agregados por el usuario.
  const addedProducts = useSelector(
  (state: RootState) => state.products.addedProducts
  );

  // Redux: permite modificar el estado global.
  const dispatch = useDispatch<AppDispatch>();

  // Función que se ejecuta al presionar el botón para solicitar taxi.
  const handleRequestTaxi = async () => {
  if (!user) {
    console.log("No hay usuario autenticado.");
    return;
  }

  if (!destination.trim()) {
    console.log("El usuario debe ingresar un destino.");
    return;
  }

  const { data, error } = await supabase
    .from("taxi_requests")
    .insert({
      user_id: user.id,
      pickup_location: "Ubicación actual",
      destination: destination.trim(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error al crear solicitud:", error);
    return;
  }

  console.log("Solicitud creada correctamente:", data);

  setRequestId(data.id);
  setRequestedDestination(destination.trim());
  setRequestSent(true);
  setDestination("");
  };

  const loadRequestStatus = async () => {
  if (!requestId) return;

  const { data, error } = await supabase
    .from("taxi_requests")
    .select("status")
    .eq("id", requestId)
    .single();

  if (error) {
    console.error("Error al consultar el estado:", error);
    return;
  }

  console.log("Estado actual de la solicitud:", data.status);
  setRequestStatus(data.status);
  };

  useEffect(() => {
  if (!requestId) return;

  loadRequestStatus();

  const interval = setInterval(() => {
    loadRequestStatus();
  }, 5000);

  return () => clearInterval(interval);
}, [requestId]);

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
      
      {/* Inventario de servicios almacenado en Redux. */}
      <View style={styles.servicesContainer}>
      <Text style={[styles.servicesTitle, { color: colors.text }]}>
      Servicios disponibles
      </Text>

        {inventory.map((product) => (
       <CustomButton
       key={product.id}
        title={`${product.name} - L ${product.price}`}
        onPress={() => {
        dispatch(addProduct(product));

        // Redux: registra en consola el producto agregado.
        console.log("Producto agregado a Redux:", product);
        }}
        />
        ))}
      </View>

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

          {/* Mensaje que muestra el estado de la solicitud. */}
          <Text
            style={[
              styles.statusText,
              { color: colors.textSecondary },
            ]}
          >
            Destino: {requestedDestination}
          </Text>
    
          {/* Mensaje que muestra el estado de la solicitud. */}
          <Text
            style={[
              styles.statusText,
              { color: colors.textSecondary },
            ]}
            >
            Estado: {requestStatus ?? "pendiente"}
          </Text>
        </View>
      )}
      {/* Productos agregados almacenados en Redux. */}
      {addedProducts.length > 0 && (
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.statusTitle,
              { color: colors.text },
            ]}
          >
            Servicios agregados
          </Text>

      {addedProducts.map((product) => (
          <Text
            key={product.id}
            style={[
              styles.statusText,
              { color: colors.textSecondary },
            ]}
          >
            {product.name} - L {product.price}
      </Text>
    ))}
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

  servicesContainer: {
    width: "100%",
    marginBottom: 20,
  },

  servicesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
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