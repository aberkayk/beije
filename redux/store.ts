import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { api } from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./auth/slice";
import insightsReducer from "./insights/slice";
import menstruationDaysReducer from "./menstruation-days/slice";

const combinedReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: persistReducer(
    { key: "auth", storage: AsyncStorage },
    authReducer
  ),
  insights: persistReducer(
    { key: "insights", storage: AsyncStorage },
    insightsReducer
  ),
  menstruationDays: persistReducer(
    { key: "menstruationDays", storage: AsyncStorage },
    menstruationDaysReducer
  ),
});

export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      api.middleware
    ),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
