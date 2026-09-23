import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import TabsNavigator from "./TabsNavigator";
import RegisterScreen from "../screens/RegisterScreen";
import { useTheme } from "../contexts/ThemeContext";
import DriverHomeScreen from "../screens/DriverHomeScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen";

// Tipado de las pantallas que pertenecen al Stack Navigator.
export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
  UserTabs: undefined;
  RegisterScreen: undefined;
  DriverHome: undefined;
  AdminHome: undefined;
};

// Creación del Stack Navigator utilizando el tipado anterior.
const Stack = createNativeStackNavigator<RootStackParamList>();

// Componente encargado de controlar la navegación principal de la aplicación.
export default function StackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
      }}
    >
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

      {/* Navegación por pestañas para el usuario. */}
      <Stack.Screen
        name="UserTabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />

      {/* Pantalla para crear una nueva cuenta. */}
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ title: "Crear cuenta" }}
      />

      {/* Pantalla inicial donde el Conductor inicia sesión. */}
      <Stack.Screen
        name="DriverHome"
        component={DriverHomeScreen}
        options={{ title: "Panel del Conductor" }}
      />

      {/* Pantalla inicial donde el Administrador inicia sesión. */}  
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Panel del Administrador"}}
      />
    </Stack.Navigator>
  );
}