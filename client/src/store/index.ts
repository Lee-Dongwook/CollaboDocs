import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import notificationReducer from "@/store/notificationSlice";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = () =>
  useDispatch<AppDispatch>();

export default store;
