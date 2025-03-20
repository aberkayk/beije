import { api } from "../api";

export const authServices = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/sign-in-request",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const {
  endpoints: { login, getProfile },
} = authServices;
export const { useLoginMutation, useGetProfileQuery } = authServices;
