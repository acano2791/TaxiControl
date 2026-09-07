import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { navigationRef } from "./src/navigation/NavigationService";
import { AuthProvider } from "./src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";

function AppNavigation() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <NavigationContainer ref={navigationRef}>
        {/* Contenedor principal que administra la navegación. */}
        <StackNavigator />
        {/* Stack Navigator que contiene las pantallas principales. */}  
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    // ThemeProvider permite compartir el tema
    // con todas las pantallas de la aplicación.
    <ThemeProvider>
    {/* AuthProvider permite compartir la sesión del usuario
          con todas las pantallas de la aplicación. */}
    <AuthProvider>      
      <AppNavigation />                 
    </AuthProvider>
    </ThemeProvider>
  );
}