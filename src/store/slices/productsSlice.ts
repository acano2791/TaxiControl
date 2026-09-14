import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../utils/types/TaxiControl";

type ProductsState = {
  inventory: Product[];
  addedProducts: Product[];
};

const initialState: ProductsState = {
  inventory: [
    {
      id: "1",
      name: "Viaje estándar",
      description: "Servicio de taxi para viajes regulares.",
      price: 100,
    },
    {
      id: "2",
      name: "Viaje VIP",
      description: "Servicio de taxi con atención preferencial.",
      price: 200,
    },
    {
      id: "3",
      name: "Traslado al aeropuerto",
      description: "Servicio de transporte hacia o desde el aeropuerto.",
      price: 300,
    },
  ],
  addedProducts: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      const exists = state.addedProducts.some(
        (product) => product.id === action.payload.id
      );

      if (exists) return;

      state.addedProducts.push(action.payload);
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.addedProducts = state.addedProducts.filter(
        (product) => product.id !== action.payload
      );
    },

    clearProducts: (state) => {
      state.addedProducts = [];
    },
  },
});

export const {
  addProduct,
  removeProduct,
  clearProducts,
} = productsSlice.actions;

export default productsSlice.reducer;