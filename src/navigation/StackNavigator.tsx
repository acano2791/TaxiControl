import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";

// Tipado de las pantallas que pertenecen al Stack Navigator.
export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
};

// Creación del Stack Navigator utilizando el tipado anterior.
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente encargado de controlar la navegación principal de la aplicación.
export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      
      {/* Pantalla inicial donde el usuario inicia sesión. */}
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "Iniciar sesión" }}
      />

      {/* Pantalla principal de TaxiControl. */}
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ title: "TaxiControl" }}
      />

    </Stack.Navigator>
  );
}