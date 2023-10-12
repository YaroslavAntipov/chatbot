import { createSlice } from "@reduxjs/toolkit";
import { IStrapiStore, IUser } from "../interface";
import { commonApi } from '../api/commonApi';

const initialState: IStrapiStore = {
  isAuthenticated: false,
  jwt: "",
  user: {} as IUser,
};

// creating action-reducer slice
export const StrapiSlice = createSlice({
  name: "strapi_slice",
  initialState,
  reducers: {
    logout: () => initialState
  },
  extraReducers: (builder) => {
    builder.addMatcher(commonApi.endpoints.login.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
      state.jwt = action.payload.jwt;
      state.isAuthenticated = true;
    });
    builder.addMatcher(commonApi.endpoints.register.matchFulfilled, (state, action) => {
      state.user = action.payload.user;
      state.jwt = action.payload.jwt;
      state.isAuthenticated = true;
    });
  }
});

// Action creators are generated for each case reducer function
export const { logout } = StrapiSlice.actions;

export default StrapiSlice.reducer;