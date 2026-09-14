import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserRole } from "../../utils/types/TaxiControl";

const initialUser: User = {
  email: "",
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
        role: UserRole;
      }>
    ) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },

    clearUser: (state) => {
      state.email = "";
      state.role = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;