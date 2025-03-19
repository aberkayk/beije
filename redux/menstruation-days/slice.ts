import { createSlice } from "@reduxjs/toolkit";
import { getMenstruationDays, menstruationDaysServices } from "./services";
import { RootState } from "../store";
import { MenstruationDay } from "@/types/menstruation";

interface MenstruationDaysState {
  days: MenstruationDay[];
}

const initialState: MenstruationDaysState = {
  days: [],
};

const menstruationDaysSlice = createSlice({
  name: "menstruationDays",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      getMenstruationDays.matchFulfilled,
      (state, action) => {
        state.days = action.payload.data.menstruationDays;
      }
    );
  },
});

export const selectMenstruationDays = (state: RootState) =>
  state.menstruationDays.days;

export default menstruationDaysSlice.reducer;
