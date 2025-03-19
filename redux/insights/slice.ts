import { createSlice } from "@reduxjs/toolkit";
import { getInsights, insightsServices } from "./services";
import { RootState } from "../store";
import { Insight } from "@/types/insights";

interface InsightsState {
  insights: Insight[];
}

const initialState: InsightsState = {
  insights: [],
};

const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(getInsights.matchFulfilled, (state, action) => {
      state.insights = action.payload.data.insights;
    });
  },
});

export const selectInsights = (state: RootState) =>
  state.insights.insights;

export default insightsSlice.reducer;
