import { createSlice } from "@reduxjs/toolkit";
import { login, getProfile, authServices } from "./services";
import { RootState } from "../store";
import { AuthUser } from "@/types/auth";
import { Profile } from "@/types/profile";

interface AuthState {
  user: AuthUser | null;
  token: string;
  profile: Profile | null;
}

const initialState: AuthState = {
  user: null,
  token: "",
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(login.matchFulfilled, (state, action) => {
        state.token = action.payload.data.token;
      })
      .addMatcher(getProfile.matchFulfilled, (state, action) => {
        state.profile = action.payload.data;
      });
  },
});

export const selectIsAuth = (state: RootState) => !!state.auth.token;
export const selectProfile = (state: RootState) => state.auth.profile;

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
