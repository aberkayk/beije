import { Tags } from "@/constants/Enums";
import { api } from "../api";
import { InsightsResponse } from "@/types/insights";

export const insightsServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getInsights: builder.query<InsightsResponse, void>({
      query: () => ({
        url: "/insights",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  endpoints: { getInsights },
} = insightsServices;

export const { useGetInsightsQuery } = insightsServices;
