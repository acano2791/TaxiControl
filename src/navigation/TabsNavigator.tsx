import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import RequestTaxiScreen from "../screens/RequestTaxiScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

// Tipado de las pantallas que pertenecen a las pestañas.
export type TabsParamList = {
  HomeTab: undefined;
  RequestTaxiTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};

// Creación del navegador de pestañas utilizando el tipado anterior.
const Tab = createBottomTabNavigator<TabsParamList>();

// Componente encargado de controlar las pestañas principales del usuario.
export default function TabsNavigator() {
  // Obtiene los colores del tema actual.
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      }}
    >
      {/* Pestaña principal de TaxiControl. */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Inicio",tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ), }}
      />

      {/* Pestaña para solicitar un taxi cercano. */}
      <Tab.Screen
        name="RequestTaxiTab"
        component={RequestTaxiScreen}
        options={{ title: "Solicitar",tabBarIcon: ({ color, size }) => (
          <Ionicons name="car-outline" size={size} color={color} />
        ), }}
      />

      {/* Pestaña donde se mostrará el historial de viajes. */}
      <Tab.Screen
        name="HistoryTab"
        component={HistoryScreen}
        options={{ title: "Historial",tabBarIcon: ({ color, size }) => (
          <Ionicons name="time-outline" size={size} color={color} />
        ), }}
      />

      {/* Pestaña donde se mostrará la información del usuario. */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Perfil",tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ), }}
      />
    </Tab.Navigator>
  );
}