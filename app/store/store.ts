import { configureStore } from "@reduxjs/toolkit";
import addBlogReducer from "./addBlogSlice";

// Configure the store
const store = configureStore({
  reducer: {
    blog: addBlogReducer, // Assuming this is the correct reducer for handling blog state
  },
});

export type AppDispatch = typeof store.dispatch; // Correctly types dispatch function

export type RootState = ReturnType<typeof store.getState>; // Correctly types the state

export default store;
