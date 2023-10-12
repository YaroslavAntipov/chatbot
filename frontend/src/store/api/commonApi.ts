import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUser } from "../interface";


// API endpoint for fetching data
export const commonApi = createApi({
  reducerPath: "commonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ jwt: string, user: IUser }, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/api/auth/local',
        method: 'POST',
        body: { identifier: email, password },
      }),
    }),
    register: builder.mutation<{ jwt: string, user: IUser }, { name: string, surname: string, email: string; password: string }>({
      query: ({ email, password, name, surname }) => ({
        url: '/api/auth/local/register',
        method: 'POST',
        body: { email, password, username: `${name} ${surname}` },
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = commonApi;