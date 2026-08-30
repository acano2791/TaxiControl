import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./src/navigation/StackNavigator";
import { navigationRef } from "./src/navigation/NavigationService";

export default function App() {
  return (
    // Contenedor principal que administra la navegación de la aplicación.
    <NavigationContainer ref={navigationRef}>
      {/* Stack Navigator que contiene las pantallas principales. */}
      <StackNavigator />
    </NavigationContainer>
  );
}
