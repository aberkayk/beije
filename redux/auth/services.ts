import { Tags } from "@/constants/enums";
import { api } from "../api";

export const authServices = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/sign-in-request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [Tags.User],
    }),
    getProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        headers: {
          "x-auth-token": localStorage.getItem("token") || "",
        },
      }),
      providesTags: [Tags.User],
    }),
  }),
  overrideExisting: true,
});

export const {
  endpoints: { login, getProfile },
} = authServices;
export const { useLoginMutation, useGetProfileQuery } = authServices;
