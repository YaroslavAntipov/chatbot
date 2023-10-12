import { configureStore } from '@reduxjs/toolkit';
import { commonApi } from "./api/commonApi";
import { authApi } from "./api/authApi";

import { StrapiSlice } from "./slice/StrapiSlice";

export const store = configureStore({
  reducer: {
    main: StrapiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({}).concat([authApi.middleware, commonApi.middleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;