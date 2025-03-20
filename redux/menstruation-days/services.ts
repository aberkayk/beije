import { api } from "../api";
import { MenstruationDaysResponse } from "@/types/menstruation";

export const menstruationDaysServices = api.injectEndpoints({
  endpoints: (builder) => ({
    getMenstruationDays: builder.query<MenstruationDaysResponse, void>({
      query: () => ({
        url: "/menstruation-days",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  endpoints: { getMenstruationDays },
} = menstruationDaysServices;

export const { useGetMenstruationDaysQuery } = menstruationDaysServices;
