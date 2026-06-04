import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "./recipeSlice";
import favouriteReducer from "./favouriteSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    favourites: favouriteReducer,
    auth: authReducer,
  },
});