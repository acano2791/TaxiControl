import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { navigationRef } from "./src/navigation/NavigationService";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function App() {
  return (
    // AuthProvider permite compartir la sesión del usuario
    // con todas las pantallas de la aplicación.
    <AuthProvider>
      {/* Contenedor principal que administra la navegación. */}
      <NavigationContainer ref={navigationRef}>
        {/* Stack Navigator que contiene las pantallas principales. */}
        <StackNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}