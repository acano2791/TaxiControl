import { createNavigationContainerRef } from "@react-navigation/native";

// Referencia global que permitirá controlar la navegación
// desde componentes que no reciben directamente la propiedad navigation.
export const navigationRef = createNavigationContainerRef();