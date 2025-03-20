import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "./store";
import { Tags } from "@/constants/Enums";

// Create our baseQuery instance
export const baseQuery = fetchBaseQuery({
  baseUrl: "https://96318a87-0588-4da5-9843-b3d7919f1782.mock.pstmn.io",
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state
  },
});

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "beije",
  baseQuery: baseQuery,
  tagTypes: [Tags.User, Tags.MenstruationDays, Tags.Insights],
  endpoints: () => ({}),
});
// Export hooks for usage in function components, which are
// auto-generated based on the defined endpoints
export const {} = api;
