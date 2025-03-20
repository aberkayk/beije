import { AuthUser } from "@/types/auth";
import { ProfileData } from "@/types/profile";
import { createSlice } from "@reduxjs/toolkit";
import { login, getProfile, authServices } from "./services";
import { RootState } from "../store";

interface AuthState {
  user: AuthUser | null;
  token: string;
  profile: ProfileData | null;
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
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(login.matchFulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addMatcher(getProfile.matchFulfilled, (state, action) => {
        state.profile = action.payload.data;
      });
  },
});

export const selectIsAuth = (state: RootState) => !!state.auth.token;
export const selectProfile = (state: RootState) => state.auth.profile;

export const { setToken, setProfile } = authSlice.actions;
export default authSlice.reducer;
