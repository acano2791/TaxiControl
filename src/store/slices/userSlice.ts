import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../utils/types/TaxiControl";

const initialUser: User = {
  email: "",
  name: "",
  phone: "",
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUser,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        email: string;
        name: string;
        phone: string;
        role: UserRole;
      }>
    ) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.role = action.payload.role;
    },

    clearUser: (state) => {
      state.email = "";
      state.name = "";
      state.phone = "";
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;