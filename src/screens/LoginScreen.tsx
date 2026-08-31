import { StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomButton from "../components/CustomButton";
import { RootStackParamList } from "../navigation/StackNavigator";

// Tipo utilizado para definir las rutas disponibles dentro del Stack.
type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "LoginScreen"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  // Navega hacia las pestañas principales de TaxiControl.
  const handleLogin = () => {
    navigation.navigate("UserTabs");
  };

  return (
    <View style={styles.container}>
      {/* Título principal de la aplicación. */}
      <Text style={styles.title}>TaxiControl</Text>

      {/* Texto que indica la función de esta pantalla. */}
      <Text style={styles.subtitle}>
        Inicia sesión para continuar
      </Text>

      {/* Botón utilizado para probar la navegación hacia UserTabs. */}
      <CustomButton
        title="Iniciar sesión"
        onPress={handleLogin}
      />
    </View>
  );
}

// Estilos de la pantalla de inicio de sesión.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});